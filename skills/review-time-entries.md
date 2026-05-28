# Review Time Entries

Review AI-generated time entry suggestions and interactively approve, reject, or regenerate them.

## Instructions

1. Call `get_current_user` to get the user's timezone.
2. Ask the user which date to review. Default to today if not specified.
3. Call `list_my_time_entries` with `statuses: ["pending", "generating", "failed"]` for the requested date to find all AI-generated suggestions awaiting review.
4. If no suggestions are found, let the user know and offer to generate new ones using `generate_time_entries`.
5. Present each suggestion clearly:
   - Time range (formatted in the user's timezone)
   - Duration
   - Title and description
   - Client / Project / Task assignments
   - Status (pending, generating, or failed)
6. For each suggestion, ask the user what they'd like to do:
   - **Approve**: Call `approve_time_entries` with the entry ID to accept it.
   - **Reject**: Call `reject_time_entries` with the entry ID to dismiss it.
   - **Edit then approve**: Call `update_time_entry` to fix the title, times, or project assignment, then approve.
   - **Regenerate**: Call `regenerate_time_entry` to get a new AI suggestion for that time block.
   - **Skip**: Move to the next entry without action.
7. After processing all entries, provide a summary:
   - Number approved, rejected, edited, and regenerated.
   - Total hours approved.
   - Any remaining pending entries.
8. If entries have `status: "failed"`, suggest regenerating them since the AI generation encountered an error.
9. If entries have `status: "generating"`, let the user know they're still being processed and to check back shortly.
