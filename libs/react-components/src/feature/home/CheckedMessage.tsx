import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface CheckedMessageProps {
  checked: boolean;
  checkedMessage: string;
  uncheckedMessage: string;
}

export const CheckedMessage = ({
  checked,
  checkedMessage,
  uncheckedMessage,
}: CheckedMessageProps) => {
  return (
    <div className="flex w-full items-center gap-x-2">
      {checked ? (
        <>
          <CheckCircleIcon className="w-8 flex-shrink-0 text-emerald-500" />
          <div>{checkedMessage}</div>
        </>
      ) : (
        <>
          <XCircleIcon className="w-8 flex-shrink-0 text-rose-500" />
          <div>{uncheckedMessage}</div>
        </>
      )}
    </div>
  );
};
