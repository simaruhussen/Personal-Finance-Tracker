import React from "react";
import { useAccountsCardState } from "../../features/accounts/useAccountsCardState";
import { queryErrorToMessage, mutationErrorToMessage } from "../../features/accounts/queries";
import AccountsCardView from "./AccountsCardView";

type Props = {
  editable?: boolean;
};

export default function AccountsCard({ editable = false }: Props) {
  const state = useAccountsCardState(editable);

  const errorMessage = state.error ? queryErrorToMessage(state.error) : null;
  const mutationErrorMessage = state.mutationError ? mutationErrorToMessage(state.mutationError) : null;

  return (
    <AccountsCardView
      status={state.status}
      accounts={state.accounts}
      totalBalance={state.totalBalance}
      localBalances={state.localBalances}
      editable={editable}
      isMutating={state.isMutating}
      errorMessage={errorMessage}
      mutationErrorMessage={mutationErrorMessage}
      onRetry={state.refetch}
      onChangeBalance={state.handleChange}
      onSubmit={state.handleSubmit}
    />
  );
}
