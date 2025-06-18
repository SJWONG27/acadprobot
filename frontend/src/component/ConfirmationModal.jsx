export default function ConfirmationModal({title, onConfirm, onCancel}) {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>
            This action cannot be undone.
          </p>
        </div>
        <div className="flex flex-row justify-around mt-5">
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Confirm
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center rounded-md  bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  )
}