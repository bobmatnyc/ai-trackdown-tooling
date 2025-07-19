# AI Trackdown CLI v1.1.7

[![npm version](https://badge.fury.io/js/@bobmatnyc%2Fai-trackdown-tools.svg)](https://badge.fury.io/js/@bobmatnyc%2Fai-trackdown-tools)
[![npm downloads](https://img.shields.io/npm/dm/@bobmatnyc/ai-trackdown-tools.svg)](https://www.npmjs.com/package/@bobmatnyc/ai-trackdown-tools)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node Version](https://img.shields.io/node/v/@bobmatnyc/ai-trackdown-tools.svg)](https://www.npmjs.com/package/@bobmatnyc/ai-trackdown-tools)
[![AI-Trackdown Compatibility](https://img.shields.io/badge/ai--trackdown-%5E1.0.0-brightgreen.svg)](https://github.com/bobmatnyc/ai-trackdown)

A professional CLI tool for AI-first project management with hierarchical Epic→Issue→Task workflows, comprehensive Pull Request management, token tracking, and YAML frontmatter support.

**Compatible with ai-trackdown schema v1.0.0 and above**

## What's New in v1.3.0

🚀 **Audit Trail Support**: New `--notes` and `--reason` options for issue/task updates  
🚀 **State Change Tracking**: Document reasons for status changes with `--reason`  
🚀 **General Notes**: Add timestamped notes to any issue/task with `--notes`  
🚀 **Completion Notes**: Track completion details with `--completion-notes`  

### Previous v1.1.7 Features
🚀 **CLI Index Corruption Fix**: Resolved "No items found" errors in status and backlog commands  
🚀 **Index Auto-Repair System**: Automatic detection and repair of corrupted index files  
🚀 **New index-health Command**: Diagnostic command for CLI index validation and repair  
🚀 **Enhanced CLI Reliability**: Improved index validation and error recovery mechanisms  
🚀 **Flexible Epic Assignment**: Epic IDs are now optional - create standalone issues or add epic assignment later  
🚀 **Anywhere-Submit Functionality**: Execute commands from anywhere with `--project-dir` for seamless multi-project workflows  

## Features

✅ **Anywhere-Submit Capability**: Work with any project from anywhere using `--project-dir`  
✅ **AI-First Design**: Built for AI collaboration with context generation and token tracking  
✅ **Flexible Hierarchical Structure**: Optional Epic → Issue → Task relationships with YAML frontmatter  
✅ **Complete PR Management**: 12 comprehensive PR commands with GitHub-independent workflows  
✅ **Agent-Optimized**: Batch operations and intelligent automation for AI-driven development  
✅ **Token Management**: Comprehensive token tracking and budget alerts  
✅ **AI Context Generation**: Automatic llms.txt generation for AI workflows  
✅ **Enhanced Template System**: Bundled defaults with project-specific overrides  
✅ **Performance Optimized**: <10ms response times with intelligent indexing  
✅ **Index Health Monitoring**: Built-in diagnostic and repair tools for CLI reliability  
✅ **Git-Native**: Local file-based storage with git integration  

## Installation

```bash
npm install -g @bobmatnyc/ai-trackdown-tools
```

## Quick Start

```bash
# Initialize a new ai-trackdown project
aitrackdown init --framework ai-trackdown

# Create an epic (optional)
aitrackdown epic create "User Authentication System" --priority high

# Create an issue under the epic
aitrackdown issue create "Login Flow Implementation" --epic EP-0001

# Or create a standalone issue (no epic required)
aitrackdown issue create "Bug fix for login validation" --priority medium

# Create a task under the issue
aitrackdown task create "JWT Token Validation" --issue ISS-0001

# Check project status
aitrackdown status

# Generate AI context file
aitrackdown ai generate-llms-txt

# Check CLI index health (v1.1.7+)
aitrackdown index-health
```

## Anywhere-Submit Functionality (v3.0.0)

Work with any project from anywhere using the `--project-dir` option:

```bash
# Execute commands from anywhere by specifying the project directory
aitrackdown --project-dir /path/to/project status
aitrackdown --project-dir /path/to/project epic create "New Epic"
aitrackdown --project-dir /path/to/project issue list --status active

# Useful for CI/CD pipelines and automated workflows
aitrackdown --project-dir $PROJECT_PATH pr create "Automated PR"

# Multi-project management from a single location
aitrackdown --project-dir ~/projects/app1 status
aitrackdown --project-dir ~/projects/app2 status
```

## AI-First Workflow

The CLI supports comprehensive AI development workflows with enhanced performance:

```bash
# Epic Management (< 50ms response time)
aitrackdown epic list
aitrackdown epic show EP-0001 --show-issues --show-tasks
aitrackdown epic complete EP-0001 --actual-tokens 1500

# Issue Management with flexible epic assignment
aitrackdown issue create "Feature implementation" --epic EP-0001  # Epic-assigned
aitrackdown issue create "Bug fix" --priority urgent             # Standalone issue
aitrackdown --project-dir /path/to/project issue assign ISS-0001 developer
aitrackdown issue complete ISS-0001 --auto-complete-tasks

# Task Management with Token Tracking
aitrackdown task complete TSK-0001 --tokens 250
aitrackdown task list

# AI Features with Enhanced Performance
aitrackdown ai track-tokens --report --format table
aitrackdown ai context --item-id EP-0001 --add "requirements context"

# CLI Health and Diagnostics (v1.1.7+)
aitrackdown index-health --verbose
aitrackdown index-health --repair
```

## Audit Trail Support (v1.3.0+)

Track changes and maintain comprehensive audit trails with timestamped notes and state change reasons:

```bash
# Add general notes to any issue or task
aitrackdown issue update ISS-0001 --notes "Discussed with team, approach approved"
aitrackdown task update TSK-0001 --notes "Found edge case, adding additional validation"

# Document reasons for state changes
aitrackdown issue update ISS-0001 --status active --reason "Requirements finalized, starting implementation"
aitrackdown issue update ISS-0001 --state ready_for_qa --reason "All tests passing, code review completed"

# Combine notes and reasons in a single update
aitrackdown issue update ISS-0001 --status completed --reason "All acceptance criteria met" --notes "Performance optimized, 50% faster than baseline"

# Add completion notes when finishing work
aitrackdown issue complete ISS-0001 --completion-notes "Implemented with caching strategy, reduced API calls by 80%"
aitrackdown task complete TSK-0001 --completion-notes "Refactored for better maintainability"

# Close issues with comments
aitrackdown issue close ISS-0002 --comment "Duplicate of ISS-0001, consolidating work"
```

All notes and reasons are appended to the issue/task content with timestamps, creating a permanent audit trail in the markdown files. This is perfect for:
- Tracking decision rationale
- Documenting progress and blockers
- Creating accountability records
- Supporting compliance requirements
- Facilitating team communication

## Pull Request Management

Comprehensive PR management with 12 powerful commands and enhanced performance:

```bash
# Create PR from completed tasks (epic-assigned or standalone issues)
aitrackdown --project-dir /path/to/project pr create "Implement user authentication" --issue ISS-0001 --from-tasks TSK-0001,TSK-0002
aitrackdown pr create "Bug fix for standalone issue" --issue ISS-0005 --priority urgent

# List and filter PRs (< 100ms response time)
aitrackdown pr list --pr-status open --assignee @developer --priority high
aitrackdown pr list --format table --show-details

# Review and approve PRs with enhanced templates
aitrackdown pr review PR-0001 --approve --comments "LGTM! Great implementation"
aitrackdown pr approve PR-0001 --auto-merge --merge-strategy squash

# Batch operations for multiple PRs (< 1s for 10 PRs)
aitrackdown pr batch --operation approve --filter pr-status:open --filter assignee:@team
aitrackdown pr batch --operation merge --filter pr-status:approved --merge-strategy squash

# Advanced PR management with anywhere-submit
aitrackdown --project-dir /path/to/project pr dependencies PR-0001 --add-dependency PR-0002
aitrackdown pr sync --github --repo owner/repo --update-status
aitrackdown pr archive --status merged --older-than 6months
```

### PR Features

- **GitHub-Independent**: Complete PR lifecycle without external dependencies
- **File-based Storage**: PRs stored as markdown files with YAML frontmatter
- **Status-based Organization**: Automatic file movement (draft → open → review → approved → merged)
- **Enhanced Template System**: Bundled templates with fallback mechanisms
- **Batch Operations**: Efficient bulk operations for agent-driven workflows
- **Review System**: Structured reviews with approval tracking
- **Performance Optimized**: <100ms average response times with intelligent indexing
- **Anywhere-Submit**: Execute PR commands from any location with --project-dir

## Performance Improvements (v3.0.0)

### Intelligent Indexing System
- **90%+ Performance Improvement**: Operations that took 2-5 seconds now complete in <10ms
- **Automatic Index Management**: `.ai-trackdown-index` file provides instant lookups
- **Memory Efficient**: <5MB memory usage even for large projects (1000+ items)
- **Real-time Updates**: Index automatically updates when files change

### Performance Benchmarks
- **Status Command**: <10ms (was 2-5 seconds)
- **Epic List**: <50ms (was 3-8 seconds)
- **PR Operations**: <100ms average response time
- **Search Operations**: Instant hash-based lookups

### Template System Enhancements
- **Bundled Templates**: Default templates included with CLI installation
- **Robust Fallbacks**: Automatic fallback to bundled templates when project templates missing
- **Multiple Path Resolution**: Works across different build structures and deployment methods

## Project Structure

ai-trackdown creates a hierarchical project structure:

```
project/
├── .ai-trackdown/
│   ├── config.yaml              # Project configuration
│   ├── templates/               # YAML frontmatter templates
│   └── cache/                   # Local cache files
├── tasks/                       # Unified directory structure (v3.0.0)
│   ├── .ai-trackdown-index      # Performance indexing system (v3.0.0)
│   ├── epics/
│   │   └── EP-0001-feature-name.md  # Epic with YAML frontmatter
│   ├── issues/
│   │   └── ISS-0001-issue-name.md   # Issues linked to epics
│   ├── tasks/
│   │   └── TSK-0001-task-name.md    # Tasks linked to issues
│   ├── prs/                     # Pull Request management (v2.0.0)
│   │   ├── draft/               # Draft PRs
│   │   ├── active/
│   │   │   ├── open/            # Open PRs ready for review
│   │   │   ├── review/          # PRs under review
│   │   │   └── approved/        # Approved PRs ready to merge
│   │   ├── merged/              # Successfully merged PRs
│   │   ├── closed/              # Closed/rejected PRs
│   │   ├── reviews/             # PR review files
│   │   └── logs/                # Operation logs
│   └── templates/               # Project-specific templates
│       ├── pr-review-default.yaml   # Default PR review template
│       ├── pr-review-quick.yaml     # Quick PR review template
│       └── pr-review-security.yaml  # Security PR review template
└── llms.txt                     # Generated AI context
```

## Flexible Epic Assignment (v1.1.2)

AI Trackdown now supports flexible epic assignment, allowing teams to work with or without epic structure:

### Choose Your Workflow

**Option 1: Epic-First Workflow (Traditional)**
```bash
# Create epic first
aitrackdown epic create "User Authentication System" --priority high

# Create issues under epic
aitrackdown issue create "Login Flow Implementation" --epic EP-0001
aitrackdown issue create "JWT Token Validation" --epic EP-0001
```

**Option 2: Issue-First Workflow (Flexible)**
```bash
# Create standalone issues
aitrackdown issue create "Bug fix for login validation" --priority medium
aitrackdown issue create "Update user profile form" --priority low

# Optionally assign to epic later
aitrackdown issue update ISS-0001 --epic EP-0001
```

**Option 3: Mixed Workflow (Best of Both)**
```bash
# Some issues belong to epics
aitrackdown issue create "Feature A implementation" --epic EP-0001

# Others stand alone
aitrackdown issue create "Emergency hotfix" --priority urgent

# Convert standalone to epic-assigned later
aitrackdown issue update ISS-0003 --epic EP-0002
```

### Migration Benefits

- **Backward Compatible**: Existing epic-assigned workflows unchanged
- **No Breaking Changes**: All existing commands work exactly as before  
- **Gradual Adoption**: Teams can migrate to flexible workflows over time
- **Performance**: Optional epic validation improves parser performance
- **Simplified CI/CD**: Automated issue creation without epic dependencies

### When to Use Each Approach

**Use Epic-First When:**
- Managing large, structured features
- Team prefers hierarchical planning
- Epic-level reporting and tracking needed
- Long-term project organization required

**Use Issue-First When:**
- Rapid development and iteration
- Bug fixes and maintenance tasks
- Small team or solo development
- CI/CD automated issue creation

## YAML Frontmatter

All items use structured YAML frontmatter for metadata:

### Epic-Assigned Issue (Traditional Workflow)
```yaml
---
issue_id: ISS-0001
epic_id: EP-0001  # Optional - links to epic
title: "Login Flow Implementation"
status: active
priority: high
assignee: developer
estimated_tokens: 800
---

# Issue Description
Implement user login flow with JWT validation...
```

### Standalone Issue (Flexible Workflow)
```yaml
---
issue_id: ISS-0002
title: "Independent bug fix"
status: planning
priority: medium
assignee: developer
# epic_id is optional - can be added later if needed
---

# Issue Description
Fix validation error in user registration form...
```

### Epic Example
```yaml
---
epic_id: EP-0001
title: User Authentication System
status: active
priority: high
assignee: developer
estimated_tokens: 2000
actual_tokens: 1500
ai_context: [authentication, security, user-management]
related_issues: [ISS-0001, ISS-0002]
---

# Epic Description
Comprehensive user authentication system with JWT tokens...
```

## Migration from Legacy Systems

Convert existing projects to ai-trackdown format:

```bash
# Migrate from old trackdown structure
aitrackdown migrate --from-trackdown ./old-project

# Import from various formats
aitrackdown migrate --from-json project-data.json
aitrackdown migrate --from-csv tasks.csv
```

## Command Reference

### Epic Commands
- `epic create` - Create new epic with YAML frontmatter
- `epic list` - List epics  
- `epic show` - Show detailed epic with `--show-issues` and `--show-tasks` options
- `epic update` - Update epic fields and metadata
- `epic complete` - Mark epic complete with token tracking

### Issue Commands  
- `issue create` - Create issue with optional epic assignment (`--epic` is optional)
- `issue assign` - Assign issue to team member
- `issue update` - Update issue properties including epic assignment
  - `--notes <text>` - Add timestamped notes to the issue
  - `--reason <text>` - Document reason for state/status changes
- `issue complete` - Complete issue with auto-task completion
  - `--completion-notes <text>` - Add completion notes to the issue
- `issue close` - Close issue (mark as completed)
  - `--comment <text>` - Add closing comment
- `issue list` - List issues (basic listing)
- `issue show` - Show detailed issue information

### Task Commands
- `task create` - Create task linked to issue
- `task complete` - Complete task with time/token tracking
  - `--completion-notes <text>` - Add completion notes to the task
- `task list` - List tasks (basic listing)
- `task update` - Update task status and metadata
  - `--notes <text>` - Add timestamped notes to the task
  - `--reason <text>` - Document reason for state/status changes

### Pull Request Commands (v2.0.0+)
- `pr create` - Create PR from templates with auto-linking
- `pr list` - List PRs with advanced filtering (`--pr-status`, `--assignee`, `--priority`, `--epic`, etc.)
- `pr show` - Show detailed PR with relationships
- `pr update` - Update PR properties and metadata
- `pr review` - Create structured PR reviews
- `pr approve` - Approve PR with optional auto-merge
- `pr merge` - Merge PR with strategy selection
- `pr close` - Close PR without merging
- `pr batch` - Perform bulk operations on multiple PRs
- `pr dependencies` - Manage PR dependencies
- `pr sync` - Synchronize with external systems
- `pr archive` - Archive old PRs with compression

### AI Commands
- `ai generate-llms-txt` - Generate AI context file
- `ai track-tokens` - Track and report token usage
- `ai context` - Manage AI context for items

### Project Commands
- `init` - Initialize new ai-trackdown project
- `status` - Show project overview with metrics (< 10ms with indexing)
- `export` - Export project data in various formats
- `index-health` - Diagnostic command for CLI index validation and repair

## Troubleshooting

### CLI Index Issues (Resolved in v1.1.7)

**Previous Issue**: "No items found" errors in status and backlog commands due to index corruption  
**Resolution**: Automatic index validation and repair system with new index-health command

**Previous Issue**: Index corruption causing CLI commands to fail  
**Resolution**: Built-in health checks for index integrity with automatic recovery

**Previous Issue**: Manual index rebuilding required when corruption detected  
**Resolution**: Graceful handling of index corruption scenarios with auto-repair

#### Using the index-health Command

```bash
# Basic health check
aitrackdown index-health

# Detailed diagnostics with verbose output
aitrackdown index-health --verbose

# Auto-repair detected issues
aitrackdown index-health --repair

# Force complete index rebuild
aitrackdown index-health --rebuild-index
```

### Epic Assignment Issues (Resolved in v1.1.2)

**Previous Issue**: "epic_id is required" parser errors when creating standalone issues
**Resolution**: Epic IDs are now optional in all ticket formats

**Previous Issue**: Parser validation failed when epic_id field was missing  
**Resolution**: Updated TypeScript interfaces and parser to handle optional epic assignment

**Previous Issue**: Could not create issues without epic assignment  
**Resolution**: Issue creation now works with or without epic_id field

### Common Migration Questions

**Q: Will my existing epic-assigned issues still work?**  
A: Yes, all existing workflows are fully backward compatible. No changes needed.

**Q: Can I mix epic-assigned and standalone issues in the same project?**  
A: Yes, you can use any combination. The parser handles both formats seamlessly.

**Q: How do I convert a standalone issue to epic-assigned later?**  
A: Use `aitrackdown issue update ISS-XXXX --epic EP-YYYY` to assign an epic to an existing issue.

**Q: Do I need to update my templates?**  
A: No, existing templates continue to work. Epic_id field is optional in all templates.

**Q: Will this affect performance?**  
A: Performance actually improves due to optional validation reducing parser overhead.

### General Troubleshooting

For other issues, check:
1. Verify ai-trackdown initialization: `aitrackdown status`
2. Check CLI index health: `aitrackdown index-health` (v1.1.7+)
3. Check project structure: Ensure `.ai-trackdown/` directory exists
4. Template issues: CLI includes bundled fallback templates
5. Performance: Index rebuilds automatically if corrupted or use `aitrackdown index-health --repair`

## Recent Enhancements

### Major Enhancements

#### CLI Index Reliability (v1.1.7)
- **Index Corruption Fix**: Resolved "No items found" errors in status and backlog commands
- **Auto-Repair System**: Automatic detection and repair of corrupted index files  
- **Health Monitoring**: New index-health command for diagnostic and repair operations
- **Enhanced Error Recovery**: Graceful handling of index corruption scenarios
- **Improved CLI Reliability**: Built-in health checks for index integrity
- **Performance Consistency**: Ensures reliable CLI performance across all operations

#### Flexible Epic Assignment (v1.1.2)
- **Optional Epic IDs**: Create standalone issues without epic assignment requirement
- **Backward Compatible**: All existing epic-assigned workflows continue unchanged
- **Mixed Workflows**: Support both epic-assigned and standalone issues in same project
- **Performance Improvement**: Optional validation reduces parser overhead
- **CI/CD Friendly**: Automated issue creation without epic dependencies
- **Gradual Migration**: Teams can adopt flexible workflows over time

#### Anywhere-Submit Functionality
- **Global Project Access**: Execute commands from any location using `--project-dir`
- **CI/CD Integration**: Perfect for automated workflows and build systems
- **Multi-Project Management**: Manage multiple projects from a single location

#### Performance Revolution
- **90%+ Speed Improvement**: Intelligent indexing system (.ai-trackdown-index)
- **Sub-10ms Operations**: Status and listing commands complete in <10ms
- **Memory Efficient**: <5MB memory usage for large projects
- **Real-time Updates**: Index automatically maintains itself

#### Enhanced Template System
- **Bundled Templates**: Default templates included with CLI installation
- **Robust Fallbacks**: Automatic fallback when project templates missing
- **Multiple Path Resolution**: Works across different build structures
- **Zero Configuration**: Works out-of-the-box without setup

#### Directory Structure Improvements
- **Unified Path Resolution**: Consistent path handling across all commands
- **Configurable Root**: Use `--root-dir` or `--tasks-dir` for custom layouts
- **Legacy Compatibility**: Seamless migration from older structures

### Bug Fixes
- Fixed template loading issues in different deployment scenarios
- Resolved path resolution conflicts in distributed environments
- Improved error handling and user feedback
- Fixed CLI option parsing inconsistencies

### Migration Notes
- All existing projects continue to work without changes
- New projects automatically get performance optimizations
- Legacy projects benefit from performance improvements immediately
- No breaking changes to existing command syntax

