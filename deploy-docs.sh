#!/bin/bash

# 🚀 GitHub Pages Documentation Deployment Script
# For @starknet-io/types-js
#
# Usage:
#   ./deploy-docs.sh                    # Deploy with defaults
#   ./deploy-docs.sh --setup           # Initial GitHub Pages setup
#   ./deploy-docs.sh --manual          # Manual deployment
#   ./deploy-docs.sh --preview         # Preview mode (no deploy)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO="starknet-io/types-js"
BRANCH="main"
DOCS_DIR="docs"
GITHUB_PAGES_URL="https://starknet-io.github.io/types-js"

# Functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ] || ! grep -q "@starknet-io/types-js" package.json; then
        log_error "Not in the @starknet-io/types-js repository root"
        exit 1
    fi
    
    # Check for required tools
    command -v gh >/dev/null 2>&1 || { log_error "GitHub CLI (gh) is required but not installed"; exit 1; }
    command -v npm >/dev/null 2>&1 || { log_error "npm is required but not installed"; exit 1; }
    command -v git >/dev/null 2>&1 || { log_error "git is required but not installed"; exit 1; }
    
    # Check git status
    if [ -n "$(git status --porcelain)" ]; then
        log_warning "Working directory has uncommitted changes"
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Deployment cancelled"
            exit 0
        fi
    fi
    
    log_success "Prerequisites check passed"
}

setup_github_pages() {
    log_info "Setting up GitHub Pages..."
    
    # Enable GitHub Pages via API
    log_info "Configuring GitHub Pages settings..."
    
    # Check current Pages configuration
    if gh api "repos/$REPO/pages" >/dev/null 2>&1; then
        log_warning "GitHub Pages already configured"
        gh api "repos/$REPO/pages" | jq -r '"Status: " + .status + " | URL: " + .html_url'
    else
        log_info "Enabling GitHub Pages..."
        
        # Create Pages site
        gh api \
          --method POST \
          -H "Accept: application/vnd.github+json" \
          "/repos/$REPO/pages" \
          -f source='{"branch":"main","path":"/docs"}' \
          2>/dev/null || {
            log_warning "Could not enable via API, please enable manually:"
            echo "1. Go to https://github.com/$REPO/settings/pages"
            echo "2. Set Source to 'Deploy from a branch'"
            echo "3. Select 'main' branch and '/docs' folder"
            echo "4. Click 'Save'"
        }
    fi
    
    log_success "GitHub Pages setup complete"
}

build_documentation() {
    log_info "Building documentation..."
    
    # Clean previous build
    log_info "Cleaning previous build..."
    npm run clean || true
    rm -rf $DOCS_DIR/ || true
    
    # Install dependencies
    log_info "Installing dependencies..."
    npm ci --prefer-offline --no-audit
    
    # Build the package
    log_info "Building TypeScript..."
    npm run build
    
    # Generate documentation
    log_info "Generating TypeDoc documentation..."
    npm run docs:generate
    
    # Validate documentation
    if [ ! -f "$DOCS_DIR/index.html" ]; then
        log_error "Documentation generation failed - index.html not found"
        exit 1
    fi
    
    # Statistics
    local html_files=$(find $DOCS_DIR -name "*.html" | wc -l)
    local total_size=$(du -sh $DOCS_DIR | cut -f1)
    
    log_success "Documentation built successfully"
    log_info "Statistics: $html_files HTML files, $total_size total size"
    
    # Verify guide integration
    if grep -q "Developer Guides" "$DOCS_DIR/index.html"; then
        log_success "Guide links verified in documentation"
    else
        log_warning "Guide links not found in documentation"
    fi
}

deploy_to_github_pages() {
    log_info "Deploying to GitHub Pages..."
    
    # Ensure we're on the right branch
    if [ "$(git branch --show-current)" != "$BRANCH" ]; then
        log_warning "Not on $BRANCH branch, switching..."
        git checkout $BRANCH
    fi
    
    # Pull latest changes
    log_info "Pulling latest changes..."
    git pull origin $BRANCH
    
    # Add documentation files
    log_info "Adding documentation files to git..."
    git add $DOCS_DIR/
    
    # Check if there are changes to commit
    if git diff --staged --quiet; then
        log_info "No documentation changes to commit"
    else
        # Commit documentation
        local commit_msg="docs: update TypeDoc documentation 📚

- Regenerated API documentation
- Updated guide links integration
- Documentation size: $(du -sh $DOCS_DIR | cut -f1)
- Generated: $(date -u +"%Y-%m-%d %H:%M UTC")

🤖 Automated documentation deployment"
        
        log_info "Committing documentation changes..."
        git commit -m "$commit_msg"
        
        # Push to GitHub
        log_info "Pushing to GitHub..."
        git push origin $BRANCH
        
        log_success "Documentation pushed to GitHub"
    fi
    
    log_info "GitHub Pages will deploy automatically from the docs/ folder"
    log_info "Deployment URL: $GITHUB_PAGES_URL"
    log_info "Note: It may take 5-10 minutes for changes to be visible"
}

preview_documentation() {
    log_info "Starting documentation preview..."
    
    build_documentation
    
    log_success "Documentation preview ready"
    log_info "Starting local server..."
    log_info "Open http://localhost:3000 in your browser"
    log_info "Press Ctrl+C to stop the server"
    
    npm run docs:serve
}

manual_deployment() {
    log_info "Starting manual deployment..."
    
    build_documentation
    
    log_info "Manual deployment options:"
    echo "1. Deploy via git push (recommended)"
    echo "2. Deploy via GitHub Actions workflow"
    echo "3. Cancel"
    
    read -p "Choose option (1-3): " -n 1 -r
    echo
    
    case $REPLY in
        1)
            deploy_to_github_pages
            ;;
        2)
            log_info "Triggering GitHub Actions deployment..."
            gh workflow run docs.yml --ref $BRANCH
            log_success "GitHub Actions workflow triggered"
            log_info "Check status: gh run list --workflow=docs.yml"
            ;;
        3)
            log_info "Deployment cancelled"
            exit 0
            ;;
        *)
            log_error "Invalid option"
            exit 1
            ;;
    esac
}

show_status() {
    log_info "GitHub Pages Status:"
    
    if gh api "repos/$REPO/pages" >/dev/null 2>&1; then
        gh api "repos/$REPO/pages" | jq -r '
            "📍 URL: " + .html_url + "\n" +
            "📊 Status: " + .status + "\n" +
            "🌿 Source: " + .source.branch + " branch, " + .source.path + " folder\n" +
            "🔒 HTTPS: " + (.https_enforced | tostring)
        '
        
        # Check if site is accessible
        if curl -s -f "$GITHUB_PAGES_URL" >/dev/null; then
            log_success "Documentation is accessible"
        else
            log_warning "Documentation may not be ready yet"
        fi
    else
        log_warning "GitHub Pages not configured for this repository"
        echo "Run: $0 --setup"
    fi
    
    # Show recent workflow runs
    log_info "Recent documentation deployments:"
    gh run list --workflow=docs.yml --limit=3 --json status,conclusion,createdAt,url | \
        jq -r '.[] | "• " + .status + " (" + .conclusion + ") - " + .createdAt + " - " + .url'
}

# Main script logic
case "${1:-}" in
    --setup)
        check_prerequisites
        setup_github_pages
        ;;
    --manual)
        check_prerequisites
        manual_deployment
        ;;
    --preview)
        check_prerequisites
        preview_documentation
        ;;
    --status)
        show_status
        ;;
    --help|-h)
        echo "🚀 GitHub Pages Documentation Deployment"
        echo ""
        echo "Usage:"
        echo "  $0                # Default deployment"
        echo "  $0 --setup       # Initial GitHub Pages setup"
        echo "  $0 --manual      # Manual deployment with options"
        echo "  $0 --preview     # Preview documentation locally"
        echo "  $0 --status      # Show deployment status"
        echo "  $0 --help        # Show this help"
        echo ""
        echo "Environment:"
        echo "  Repository: $REPO"
        echo "  Branch: $BRANCH"  
        echo "  Documentation: $GITHUB_PAGES_URL"
        ;;
    "")
        # Default deployment
        check_prerequisites
        build_documentation
        deploy_to_github_pages
        show_status
        ;;
    *)
        log_error "Unknown option: $1"
        echo "Use $0 --help for usage information"
        exit 1
        ;;
esac

log_success "Script completed successfully"