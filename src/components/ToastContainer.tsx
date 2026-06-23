import { useToastDismiss, useToastEntries } from '../services/toast-context';

export default function ToastContainer() {
  const entries = useToastEntries();
  const dismiss = useToastDismiss();

  return (
    <div className="toast-wrap" id="toastWrap">
      {entries.map((entry) => (
        <div
          className={`toast ${entry.type}`}
          key={entry.id}
          onClick={() => dismiss(entry.id)}
        >
          {entry.message}
        </div>
      ))}
    </div>
  );
}
