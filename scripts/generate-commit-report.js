
#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function generateCommitReport(days = 2) {
  const sinceDate = `${days} days ago`;
  
  try {
    // Get commit log for the specified period
    const gitLogCommand = `git log --since="${sinceDate}" --pretty=format:"%h|%an|%ae|%ad|%s" --date=iso-strict`;
    const gitLogOutput = execSync(gitLogCommand, { encoding: 'utf8' }).trim();
    
    if (!gitLogOutput) {
      console.log(`📋 Commit Report - Last ${days} Days`);
      console.log('=' .repeat(50));
      console.log('No commits found in the specified period.');
      return;
    }

    const commits = gitLogOutput.split('\n').map(line => {
      const [hash, author, email, date, message] = line.split('|');
      return { hash, author, email, date: new Date(date), message };
    });

    // Get file changes for each commit
    const detailedCommits = commits.map(commit => {
      try {
        const filesChanged = execSync(`git show --name-only --pretty=format: ${commit.hash}`, { encoding: 'utf8' })
          .trim()
          .split('\n')
          .filter(file => file.length > 0);
        
        const stats = execSync(`git show --stat --pretty=format: ${commit.hash}`, { encoding: 'utf8' })
          .trim()
          .split('\n')
          .filter(line => line.includes('|'))
          .map(line => line.trim());

        return { ...commit, filesChanged, stats };
      } catch (error) {
        return { ...commit, filesChanged: [], stats: [] };
      }
    });

    // Generate report
    console.log(`📋 Hibla Manufacturing System - Commit Report`);
    console.log(`📅 Period: Last ${days} days (${new Date(Date.now() - days * 24 * 60 * 60 * 1000).toLocaleDateString()} - ${new Date().toLocaleDateString()})`);
    console.log('=' .repeat(80));
    console.log(`📊 Total Commits: ${commits.length}`);
    console.log('');

    // Summary by author
    const authorStats = {};
    commits.forEach(commit => {
      if (!authorStats[commit.author]) {
        authorStats[commit.author] = { count: 0, commits: [] };
      }
      authorStats[commit.author].count++;
      authorStats[commit.author].commits.push(commit);
    });

    console.log('👥 Commits by Author:');
    Object.entries(authorStats)
      .sort((a, b) => b[1].count - a[1].count)
      .forEach(([author, stats]) => {
        console.log(`  • ${author}: ${stats.count} commit${stats.count > 1 ? 's' : ''}`);
      });
    console.log('');

    // Detailed commit list
    console.log('📝 Detailed Commit History:');
    console.log('-' .repeat(80));
    
    detailedCommits.forEach((commit, index) => {
      console.log(`${index + 1}. ${commit.hash} - ${commit.author}`);
      console.log(`   📅 ${commit.date.toLocaleString()}`);
      console.log(`   💬 ${commit.message}`);
      
      if (commit.filesChanged.length > 0) {
        console.log(`   📁 Files changed (${commit.filesChanged.length}):`);
        commit.filesChanged.slice(0, 10).forEach(file => {
          console.log(`      • ${file}`);
        });
        if (commit.filesChanged.length > 10) {
          console.log(`      ... and ${commit.filesChanged.length - 10} more files`);
        }
      }
      
      if (commit.stats.length > 0) {
        console.log(`   📊 Changes:`);
        commit.stats.slice(0, 5).forEach(stat => {
          console.log(`      ${stat}`);
        });
        if (commit.stats.length > 5) {
          console.log(`      ... and ${commit.stats.length - 5} more changes`);
        }
      }
      
      console.log('');
    });

    // File change analysis
    const allChangedFiles = [...new Set(detailedCommits.flatMap(c => c.filesChanged))];
    if (allChangedFiles.length > 0) {
      console.log('📁 Most Modified Files:');
      const fileFrequency = {};
      detailedCommits.forEach(commit => {
        commit.filesChanged.forEach(file => {
          fileFrequency[file] = (fileFrequency[file] || 0) + 1;
        });
      });

      Object.entries(fileFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .forEach(([file, count]) => {
          console.log(`  • ${file}: ${count} change${count > 1 ? 's' : ''}`);
        });
      console.log('');
    }

    // Save to file
    const reportContent = generateMarkdownReport(detailedCommits, days, authorStats, allChangedFiles);
    const reportPath = `commit-report-${days}days-${new Date().toISOString().split('T')[0]}.md`;
    
    fs.writeFileSync(reportPath, reportContent);
    console.log(`💾 Report saved to: ${reportPath}`);
    
  } catch (error) {
    console.error('Error generating commit report:', error.message);
    process.exit(1);
  }
}

function generateMarkdownReport(commits, days, authorStats, changedFiles) {
  const now = new Date();
  const sinceDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  
  let markdown = `# Hibla Manufacturing System - Commit Report\n\n`;
  markdown += `**Period:** ${sinceDate.toLocaleDateString()} - ${now.toLocaleDateString()} (Last ${days} days)\n`;
  markdown += `**Generated:** ${now.toLocaleString()}\n`;
  markdown += `**Total Commits:** ${commits.length}\n\n`;

  // Summary by author
  markdown += `## 👥 Commits by Author\n\n`;
  Object.entries(authorStats)
    .sort((a, b) => b[1].count - a[1].count)
    .forEach(([author, stats]) => {
      markdown += `- **${author}**: ${stats.count} commit${stats.count > 1 ? 's' : ''}\n`;
    });
  markdown += `\n`;

  // Detailed commits
  markdown += `## 📝 Commit Details\n\n`;
  commits.forEach((commit, index) => {
    markdown += `### ${index + 1}. ${commit.hash} - ${commit.message}\n\n`;
    markdown += `- **Author:** ${commit.author} (${commit.email})\n`;
    markdown += `- **Date:** ${commit.date.toLocaleString()}\n`;
    
    if (commit.filesChanged.length > 0) {
      markdown += `- **Files Changed:** ${commit.filesChanged.length}\n`;
      markdown += `\n**Modified Files:**\n`;
      commit.filesChanged.forEach(file => {
        markdown += `- \`${file}\`\n`;
      });
    }
    markdown += `\n---\n\n`;
  });

  // Most modified files
  if (changedFiles.length > 0) {
    markdown += `## 📁 Most Modified Files\n\n`;
    const fileFrequency = {};
    commits.forEach(commit => {
      commit.filesChanged.forEach(file => {
        fileFrequency[file] = (fileFrequency[file] || 0) + 1;
      });
    });

    Object.entries(fileFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .forEach(([file, count]) => {
        markdown += `- \`${file}\`: ${count} change${count > 1 ? 's' : ''}\n`;
      });
    markdown += `\n`;
  }

  return markdown;
}

// Run the report generator
const days = process.argv[2] ? parseInt(process.argv[2]) : 2;
generateCommitReport(days);
