import { Transaction } from '@codemirror/state'
import { ViewUpdate } from '@codemirror/view'

export function isRemoteChange(update: ViewUpdate) {
    return update.transactions.some(t => t.annotation(Transaction.remote))
}
