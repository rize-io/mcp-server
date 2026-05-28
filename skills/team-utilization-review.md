# Team Utilization Review

Review how your team's time is distributed across clients and projects, and identify utilization patterns.

## Instructions

1. Call `get_current_user` to confirm admin access and get org info.
2. Call `list_team_members` to get all team members with their roles and billable-by-default status.
3. Determine the current week's date range (Monday through Sunday).
4. Call `get_team_time_allocation` with `group_by: "client"` for the week to see team-wide client distribution.
5. For each team member, call `get_team_time_allocation` filtered by their email with `group_by: "project"` to get individual breakdowns.
6. Compile a report with:
   - **Team Overview**: Total team hours, number of active members, and average hours per person.
   - **Per-Member Breakdown**: Each member's total hours, top client/project, and percentage of a standard 40-hour week.
   - **Client Distribution**: Which clients are consuming the most team capacity.
   - **Utilization Flags**:
     - Members under 30 hours (potentially underutilized)
     - Members over 45 hours (potential burnout risk)
     - Members with no tracked time (missing data or time off)
   - **Recommendations**: Suggest rebalancing if any client takes more than 50% of total team capacity.
7. Format hours as decimal (e.g., "32.5h") for easy comparison.
8. If the user is not a team admin, explain that team-wide data requires admin permissions.
