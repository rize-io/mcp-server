# Profitability Check

Analyze your organization's profitability across all contracts and flag any that need attention.

## Instructions

1. Call `get_current_user` to get the user's org ID and confirm they have admin access.
2. Call `list_contracts` to get all active contracts with their billing models and client names.
3. Determine the current month's date range.
4. Call `get_org_profitability` with the org ID and current month to get aggregate metrics.
5. For each active contract, call `get_contract_profitability` to get per-contract metrics.
6. Call `get_profitability_trend` for the last 3 months to identify trends.
7. Compile a report with:
   - **Org Summary**: Total revenue, AGI, delivery costs, contribution, and overall delivery margin.
   - **Contract Scorecard**: Table of each contract showing revenue, delivery hours, margin, effective hourly rate, and budget burn.
   - **Alerts**: Flag contracts where:
     - Delivery margin is below 30%
     - Budget burn exceeds 90%
     - Effective hourly rate is below the contract's billing rate
   - **Trend**: Month-over-month revenue and margin direction (improving/declining).
8. All monetary values from the API are in cents — convert to dollars for display.
9. If the user is not an org admin, explain that profitability tools require admin access.
