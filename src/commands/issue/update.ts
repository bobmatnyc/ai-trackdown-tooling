/**
 * Issue Update Command
 * Update issue fields using YAML frontmatter system
 */

import { Command } from 'commander';
import type { IssueFrontmatter, ItemStatus, Priority, UnifiedState } from '../../types/ai-trackdown.js';
import { ConfigManager } from '../../utils/config-manager.js';
import { Formatter } from '../../utils/formatter.js';
import { FrontmatterParser } from '../../utils/frontmatter-parser.js';
import { RelationshipManager } from '../../utils/relationship-manager.js';
import { StateManager, StateTransition } from '../../types/ai-trackdown.js';

interface UpdateOptions {
  title?: string;
  description?: string;
  status?: ItemStatus;
  state?: UnifiedState;
  priority?: Priority;
  assignee?: string;
  epicId?: string;
  addTags?: string;
  removeTags?: string;
  milestone?: string;
  clearMilestone?: boolean;
  estimatedTokens?: number;
  actualTokens?: number;
  addDependencies?: string;
  removeDependencies?: string;
  addBlockedBy?: string;
  removeBlockedBy?: string;
  addBlocks?: string;
  removeBlocks?: string;
  progress?: number;
  reason?: string;
  notes?: string;
  reviewer?: string;
  dryRun?: boolean;
}

export function createIssueUpdateCommand(): Command {
  const cmd = new Command('update');

  cmd
    .description('Update an existing issue')
    .argument('<issue-id>', 'issue ID to update')
    .option('-t, --title <text>', 'update title')
    .option('-d, --description <text>', 'update description')
    .option('-s, --status <status>', 'update status (planning|active|completed|archived)')
    .option('--state <state>', 'update unified state (planning|active|completed|archived|ready_for_engineering|ready_for_qa|ready_for_deployment|won_t_do|done)')
    .option('-p, --priority <level>', 'update priority (low|medium|high|critical)')
    .option('-a, --assignee <username>', 'update assignee')
    .option('--epic-id <id>', 'update epic ID')
    .option('--add-tags <tags>', 'add tags (comma-separated)')
    .option('--remove-tags <tags>', 'remove tags (comma-separated)')
    .option('-m, --milestone <name>', 'set milestone')
    .option('--clear-milestone', 'clear milestone')
    .option('-e, --estimated-tokens <number>', 'update estimated tokens')
    .option('--actual-tokens <number>', 'update actual tokens')
    .option('--add-dependencies <ids>', 'add dependencies (comma-separated IDs)')
    .option('--remove-dependencies <ids>', 'remove dependencies (comma-separated IDs)')
    .option('--add-blocked-by <ids>', 'add blocked by (comma-separated IDs)')
    .option('--remove-blocked-by <ids>', 'remove blocked by (comma-separated IDs)')
    .option('--add-blocks <ids>', 'add blocks (comma-separated IDs)')
    .option('--remove-blocks <ids>', 'remove blocks (comma-separated IDs)')
    .option('--progress <percentage>', 'update completion percentage (0-100)')
    .option('--reason <text>', 'reason for state change (recommended for state updates)')
    .option('--notes <text>', 'add general notes to the issue')
    .option('--reviewer <username>', 'reviewer who approved the change (for state updates)')
    .option('--dry-run', 'show what would be updated without updating')
    .action(async (issueId: string, options: UpdateOptions) => {
      try {
        await updateIssue(issueId, options);
      } catch (error) {
        console.error(
          Formatter.error(
            `Failed to update issue: ${error instanceof Error ? error.message : 'Unknown error'}`
          )
        );
        process.exit(1);
      }
    });

  return cmd;
}

async function updateIssue(issueId: string, options: UpdateOptions): Promise<void> {
  const configManager = new ConfigManager();
  const config = configManager.getConfig();

  // Get CLI tasks directory from parent command options
  const cliTasksDir = process.env.CLI_TASKS_DIR; // Set by parent command

  // Get absolute paths with CLI override
  const paths = configManager.getAbsolutePaths(cliTasksDir);
  const relationshipManager = new RelationshipManager(config, paths.projectRoot, cliTasksDir);
  const parser = new FrontmatterParser();

  // Get issue hierarchy to find the issue
  const hierarchy = relationshipManager.getIssueHierarchy(issueId);
  if (!hierarchy) {
    throw new Error(`Issue not found: ${issueId}`);
  }

  const issue = hierarchy.issue;
  const filePath = issue.file_path;

  // Build updates object
  const updates: Partial<IssueFrontmatter> = {};

  if (options.title) {
    updates.title = options.title;
  }

  if (options.description) {
    updates.description = options.description;
  }

  if (options.status) {
    updates.status = options.status;
  }

  // Handle state updates with proper validation
  if (options.state) {
    const currentState = StateManager.getEffectiveState(issue);
    
    // Validate state transition
    const transitionResult = StateTransition.transitionState(
      issue,
      options.state,
      process.env.USER || 'system',
      options.reason,
      options.reviewer
    );

    if (!transitionResult.success) {
      console.error(Formatter.error('State transition failed:'));
      transitionResult.errors.forEach(error => 
        console.error(Formatter.error(`  - ${error}`))
      );
      throw new Error('Invalid state transition');
    }

    if (transitionResult.warnings.length > 0) {
      console.log(Formatter.warning('State transition warnings:'));
      transitionResult.warnings.forEach(warning => 
        console.log(Formatter.warning(`  - ${warning}`))
      );
    }

    updates.state = transitionResult.item.state;
    updates.state_metadata = transitionResult.item.state_metadata;
  }

  if (options.priority) {
    updates.priority = options.priority;
  }

  if (options.assignee) {
    updates.assignee = options.assignee;
  }

  if (options.epicId) {
    updates.epic_id = options.epicId;
  }

  if (options.milestone) {
    updates.milestone = options.milestone;
  }

  if (options.clearMilestone) {
    updates.milestone = undefined;
  }

  if (options.estimatedTokens !== undefined) {
    updates.estimated_tokens = parseInt(options.estimatedTokens.toString(), 10);
  }

  if (options.actualTokens !== undefined) {
    updates.actual_tokens = parseInt(options.actualTokens.toString(), 10);
  }

  if (options.progress !== undefined) {
    const progress = parseInt(options.progress.toString(), 10);
    if (progress < 0 || progress > 100) {
      throw new Error('Progress must be between 0 and 100');
    }
    updates.completion_percentage = progress;
  }

  // Handle tags
  if (options.addTags || options.removeTags) {
    const currentTags = issue.tags || [];
    let newTags = [...currentTags];

    if (options.addTags) {
      const tagsToAdd = options.addTags.split(',').map((tag) => tag.trim());
      for (const tag of tagsToAdd) {
        if (!newTags.includes(tag)) {
          newTags.push(tag);
        }
      }
    }

    if (options.removeTags) {
      const tagsToRemove = options.removeTags.split(',').map((tag) => tag.trim());
      newTags = newTags.filter((tag) => !tagsToRemove.includes(tag));
    }

    updates.tags = newTags.length > 0 ? newTags : undefined;
  }

  // Handle dependencies
  if (options.addDependencies || options.removeDependencies) {
    const currentDeps = issue.dependencies || [];
    let newDeps = [...currentDeps];

    if (options.addDependencies) {
      const depsToAdd = options.addDependencies.split(',').map((dep) => dep.trim());
      for (const dep of depsToAdd) {
        if (!newDeps.includes(dep)) {
          newDeps.push(dep);
        }
      }
    }

    if (options.removeDependencies) {
      const depsToRemove = options.removeDependencies.split(',').map((dep) => dep.trim());
      newDeps = newDeps.filter((dep) => !depsToRemove.includes(dep));
    }

    updates.dependencies = newDeps.length > 0 ? newDeps : undefined;
  }

  // Handle blocked_by
  if (options.addBlockedBy || options.removeBlockedBy) {
    const currentBlocked = issue.blocked_by || [];
    let newBlocked = [...currentBlocked];

    if (options.addBlockedBy) {
      const blockedToAdd = options.addBlockedBy.split(',').map((id) => id.trim());
      for (const id of blockedToAdd) {
        if (!newBlocked.includes(id)) {
          newBlocked.push(id);
        }
      }
    }

    if (options.removeBlockedBy) {
      const blockedToRemove = options.removeBlockedBy.split(',').map((id) => id.trim());
      newBlocked = newBlocked.filter((id) => !blockedToRemove.includes(id));
    }

    updates.blocked_by = newBlocked.length > 0 ? newBlocked : undefined;
  }

  // Handle blocks
  if (options.addBlocks || options.removeBlocks) {
    const currentBlocks = issue.blocks || [];
    let newBlocks = [...currentBlocks];

    if (options.addBlocks) {
      const blocksToAdd = options.addBlocks.split(',').map((id) => id.trim());
      for (const id of blocksToAdd) {
        if (!newBlocks.includes(id)) {
          newBlocks.push(id);
        }
      }
    }

    if (options.removeBlocks) {
      const blocksToRemove = options.removeBlocks.split(',').map((id) => id.trim());
      newBlocks = newBlocks.filter((id) => !blocksToRemove.includes(id));
    }

    updates.blocks = newBlocks.length > 0 ? newBlocks : undefined;
  }

  // Check if we have any updates (including notes/reason)
  const hasUpdates = Object.keys(updates).length > 0 || options.notes || (options.reason && (options.state || options.status));
  
  // Show what would be updated (dry run or verbose)
  if (options.dryRun || !hasUpdates) {
    console.log(Formatter.info(`${options.dryRun ? 'Dry run - ' : ''}Issue would be updated:`));
    console.log(Formatter.debug(`Issue ID: ${issueId}`));
    console.log(Formatter.debug(`File: ${filePath}`));

    if (!hasUpdates) {
      console.log(Formatter.warning('No updates specified'));
      return;
    }

    for (const [key, value] of Object.entries(updates)) {
      const currentValue = issue[key as keyof typeof issue];
      console.log(Formatter.debug(`${key}: ${currentValue} → ${value}`));
    }

    if (options.dryRun) {
      return;
    }
  }

  // Update the updated_date
  updates.updated_date = new Date().toISOString();

  // Build append content from notes and reason
  let appendContent = '';
  const timestamp = new Date().toISOString();
  
  // Add reason if it's a state/status change and reason is provided
  if (options.reason && (options.state || options.status)) {
    appendContent += `\n## State Change: ${timestamp}\n`;
    appendContent += `**Reason**: ${options.reason}\n`;
    if (options.state) {
      appendContent += `**New State**: ${options.state}\n`;
    } else if (options.status) {
      appendContent += `**New Status**: ${options.status}\n`;
    }
    if (options.reviewer) {
      appendContent += `**Reviewer**: ${options.reviewer}\n`;
    }
  }
  
  // Add general notes if provided
  if (options.notes) {
    if (appendContent) appendContent += '\n';
    appendContent += `\n## Note: ${timestamp}\n`;
    appendContent += `${options.notes}\n`;
  }

  // Update the file with append content
  const updatedIssue = parser.updateFile(filePath, updates, appendContent || undefined);

  // Refresh cache
  relationshipManager.rebuildCache();

  console.log(Formatter.success(`Issue updated successfully!`));
  console.log(Formatter.info(`Issue ID: ${issueId}`));
  console.log(Formatter.info(`File: ${filePath}`));

  // Show what was changed
  const changedFields = Object.keys(updates).filter((key) => key !== 'updated_date');
  if (changedFields.length > 0) {
    console.log(Formatter.info(`Updated fields: ${changedFields.join(', ')}`));
  }

  // Show current values
  console.log('');
  console.log(Formatter.success('Current values:'));
  console.log(`  Title: ${updatedIssue.title}`);
  console.log(`  Status: ${getStatusDisplay(updatedIssue.status)}`);
  if (updatedIssue.state) {
    console.log(`  State: ${getStateDisplay(updatedIssue.state)}`);
  }
  console.log(`  Priority: ${getPriorityDisplay(updatedIssue.priority)}`);
  console.log(`  Assignee: ${updatedIssue.assignee}`);
  console.log(`  Epic ID: ${updatedIssue.epic_id}`);

  if (updatedIssue.milestone) {
    console.log(`  Milestone: ${updatedIssue.milestone}`);
  }

  if (updatedIssue.tags && updatedIssue.tags.length > 0) {
    console.log(`  Tags: ${updatedIssue.tags.join(', ')}`);
  }

  if (updatedIssue.completion_percentage !== undefined) {
    console.log(`  Progress: ${updatedIssue.completion_percentage}%`);
  }

  if (updatedIssue.dependencies && updatedIssue.dependencies.length > 0) {
    console.log(`  Dependencies: ${updatedIssue.dependencies.join(', ')}`);
  }

  if (updatedIssue.blocked_by && updatedIssue.blocked_by.length > 0) {
    console.log(`  Blocked By: ${updatedIssue.blocked_by.join(', ')}`);
  }

  if (updatedIssue.blocks && updatedIssue.blocks.length > 0) {
    console.log(`  Blocks: ${updatedIssue.blocks.join(', ')}`);
  }

  console.log(`  Estimated Tokens: ${updatedIssue.estimated_tokens || 0}`);
  console.log(`  Actual Tokens: ${updatedIssue.actual_tokens || 0}`);

  console.log(`  Updated: ${new Date(updatedIssue.updated_date).toLocaleString()}`);
}

function getStatusDisplay(status: string): string {
  const statusColors: Record<string, (text: string) => string> = {
    planning: (text) => Formatter.info(text),
    active: (text) => Formatter.success(text),
    completed: (text) => Formatter.success(text),
    archived: (text) => Formatter.debug(text),
  };

  const colorFn = statusColors[status] || ((text) => text);
  return colorFn(status.toUpperCase());
}

function getPriorityDisplay(priority: string): string {
  const priorityColors: Record<string, (text: string) => string> = {
    critical: (text) => Formatter.error(text),
    high: (text) => Formatter.warning(text),
    medium: (text) => Formatter.info(text),
    low: (text) => Formatter.debug(text),
  };

  const colorFn = priorityColors[priority] || ((text) => text);
  return colorFn(priority.toUpperCase());
}

function getStateDisplay(state: string): string {
  const stateColors: Record<string, (text: string) => string> = {
    planning: (text) => Formatter.info(text),
    active: (text) => Formatter.warning(text),
    completed: (text) => Formatter.success(text),
    archived: (text) => Formatter.debug(text),
    ready_for_engineering: (text) => Formatter.info(text),
    ready_for_qa: (text) => Formatter.warning(text),
    ready_for_deployment: (text) => Formatter.info(text),
    won_t_do: (text) => Formatter.error(text),
    done: (text) => Formatter.success(text),
  };

  const colorFn = stateColors[state] || ((text) => text);
  return colorFn(state.toUpperCase().replace(/_/g, ' '));
}
