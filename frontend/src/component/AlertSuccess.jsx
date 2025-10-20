import { CheckCircleIcon, XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/20/solid'

export default function AlertSuccess({text, onClose, className=""}) {
  return (
    <div className={`rounded-md bg-blue-50 p-4 ${className}`}>
      <div className="flex">
        <div className="shrink-0">
          <ExclamationTriangleIcon aria-hidden="true" className="size-5 text-indigo-700" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-indigo-800">{text}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex rounded-md bg-green-50 p-1.5 text-indigo-500 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon aria-hidden="true" className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}