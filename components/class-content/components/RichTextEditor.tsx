import { useRef } from "react";

interface Props {
  value: string;
  onChange: ( value: string ) => void;
  label?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  placeholder?: string;
}

export const RichTextEditor = (
  {
    value,
    onChange,
    label,
    errorMessage,
    isInvalid,
    placeholder,
  }: Props
) => {

  const ref = useRef<HTMLDivElement>( null );

  return (
    <div className="flex flex-col space-y-2">

      { label && (
        <label className="font-medium text-gray-700">
          { label }
        </label>
      ) }

      <div className="relative">
        { ( !value || value === "<br>" ) && placeholder && (
          <div
            className="absolute top-0 left-0 px-4 py-2 text-gray-400 pointer-events-none select-none"
          >
            { placeholder }
          </div>
        ) }

        <div
          className={
            `min-h-[150px] border rounded-lg bg-white px-4 py-2 shadow-sm outline-none focus:ring-2 
            ${ isInvalid ? "border-red-500 ring-2 ring-red-500" : "border-gray-300" }
            ${ ( !value || value === "<br>" ) && placeholder ? "relative z-10" : "" }`
          }
          contentEditable
          ref={ ref }
          dangerouslySetInnerHTML={ { __html: value } }
          onInput={ ( e ) => {
            onChange( ( e.target as HTMLDivElement ).innerHTML );
          } }
          suppressContentEditableWarning
          aria-label={ label }
        />
      </div>

      { errorMessage && (
        <span className="text-xs text-red-600">
          { errorMessage }
        </span>
      ) }

    </div>
  );
};
