# Invoice Prep

Gather all billable time entries and expenses for a specific client and date range, ready for invoicing.

## Instructions

1. Call `get_current_user` to get the user's org info and timezone.
2. Ask the user which client and billing period they want to prepare an invoice for. If not specified, default to the previous month.
3. Call `list_clients` to find the client ID matching the requested client name.
4. Call `list_my_time_entries` (or `list_team_time_entries` for team-wide) filtered by the client ID and date range, with `statuses: ["active"]` to only include approved entries.
5. Call `list_projects` filtered by the client to get project names.
6. Call `get_my_time_allocation` (or `get_team_time_allocation`) with `group_by: "project"` filtered by the client ID to get hours per project.
7. If the user has contracts set up, call `get_contract_profitability` for the client's contract to get revenue and expense data.
8. Compile an invoice-ready summary:
   - **Client**: Name and billing period.
   - **Time by Project**: Table with project name, hours, and line-item totals.
   - **Entry Detail**: List of individual time entries with date, description, duration, and project.
   - **Expenses**: Any pass-through expenses from the contract period (if available).
   - **Totals**: Total billable hours, total amount (if hourly rate is known from the contract).
9. Format dates in a human-readable format and durations as hours and minutes.
10. Flag any entries missing a project assignment — these may need to be categorized before invoicing.
