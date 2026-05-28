# Productivity Insights

Analyze your daily app usage and focus patterns to surface productivity insights and improvement opportunities.

## Instructions

1. Call `get_current_user` to get the user's name and timezone.
2. Ask the user which date or date range to analyze. Default to today if not specified.
3. Call `list_my_apps_used` for the date range to get all apps and websites with time spent and categories.
4. Call `get_my_time_allocation` with `group_by: "client"` for the same range to see how tracked work aligns with app usage.
5. Call `list_my_time_entries` for the date range to see the actual work log.
6. Analyze and compile a report:
   - **Focus Summary**: Total screen time, time in focus apps vs. distracting apps (using the `is_focus` field from app data).
   - **Top Apps**: Top 10 apps/websites by time spent, with categories.
   - **Focus vs. Distraction Ratio**: Percentage of time in focus-categorized apps vs. non-focus.
   - **Context Switching**: Count of unique apps used — high counts suggest frequent context switching.
   - **Untracked Time**: Compare total app usage time against logged time entries to find gaps.
   - **Patterns**: Note any time-sink apps (e.g., if social media or messaging apps rank high).
   - **Recommendations**: Actionable suggestions like:
     - Block specific sites during focus hours
     - Batch communication into dedicated time blocks
     - Consider logging time for activities that show up in apps but not in time entries
7. Be encouraging — frame insights as opportunities, not criticisms.
