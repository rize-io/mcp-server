# Weekly Time Report

Generate a detailed weekly time report summarizing how you spent your time, broken down by client and project.

## Instructions

1. Call `get_current_user` to get the user's name, timezone, and org info.
2. Determine the current week's date range (Monday through Sunday) based on the user's timezone.
3. Call `list_my_time_entries` with the week's start and end dates to get all active time entries.
4. Call `get_my_time_allocation` with `group_by: "client"` for the same date range to get hours per client.
5. Call `get_my_time_allocation` with `group_by: "project"` for the same date range to get hours per project.
6. Compile a report with:
   - **Summary**: Total hours worked, number of entries, and date range.
   - **By Client**: Hours per client, sorted highest to lowest.
   - **By Project**: Hours per project (nested under client), sorted highest to lowest.
   - **Daily Breakdown**: Hours per day (Mon–Sun) showing work patterns.
   - **Gaps**: Flag any weekdays with zero tracked time.
7. Format all durations as hours and minutes (e.g., "6h 30m").
8. If any entries have status "pending", note how many AI suggestions are awaiting review.
