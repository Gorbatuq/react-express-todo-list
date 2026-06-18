import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import TextareaAutosize, {
  type TextareaAutosizeProps,
} from "react-textarea-autosize";

type AutoResizeTextareaProps = TextareaAutosizeProps & {
  wrapperClassName?: string;
  showOverflowFade?: boolean;
  showLengthWarning?: boolean;
  lengthWarningRatio?: number;
};

export const AutoResizeTextarea = forwardRef<
  HTMLTextAreaElement,
  AutoResizeTextareaProps
>(
  (
    {
      className = "",
      wrapperClassName = "",
      showOverflowFade = true,
      showLengthWarning = true,
      lengthWarningRatio,
      onChange,
      onScroll,
      onHeightChange,
      value,
      defaultValue,
      maxLength,
      ...props
    },
    forwardedRef,
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [fade, setFade] = useState({ top: false, bottom: false });
    const [inputLength, setInputLength] = useState(
      () => String(value ?? defaultValue ?? "").length,
    );
    const currentLength = inputLength;
    const warningLength =
      typeof maxLength === "number" && typeof lengthWarningRatio === "number"
        ? Math.floor(maxLength * lengthWarningRatio)
        : null;
    const shouldShowLengthWarning =
      showLengthWarning &&
      typeof maxLength === "number" &&
      warningLength !== null &&
      maxLength > 0 &&
      currentLength >= warningLength;

    const setRefs = useCallback(
      (element: HTMLTextAreaElement | null) => {
        textareaRef.current = element;
        if (element) {
          setInputLength(element.value.length);
        }

        if (typeof forwardedRef === "function") {
          forwardedRef(element);
          return;
        }

        if (forwardedRef) {
          forwardedRef.current = element;
        }
      },
      [forwardedRef],
    );

    const updateFade = useCallback(() => {
      if (!showOverflowFade) {
        setFade((current) =>
          current.top || current.bottom
            ? { top: false, bottom: false }
            : current,
        );
        return;
      }

      const textarea = textareaRef.current;
      if (!textarea) return;

      const hasOverflow = textarea.scrollHeight > textarea.clientHeight + 1;
      const isAtTop = textarea.scrollTop <= 1;
      const isAtBottom =
        textarea.scrollTop + textarea.clientHeight >= textarea.scrollHeight - 1;

      const nextFade = {
        top: hasOverflow && !isAtTop,
        bottom: hasOverflow && !isAtBottom,
      };

      setFade((current) =>
        current.top === nextFade.top && current.bottom === nextFade.bottom
          ? current
          : nextFade,
      );
    }, [showOverflowFade]);

    useEffect(() => {
      const nextValue =
        value ?? defaultValue ?? textareaRef.current?.value ?? "";
      setInputLength(String(nextValue).length);
      window.requestAnimationFrame(updateFade);
    }, [defaultValue, updateFade, value]);

    return (
      <div className={`relative ${wrapperClassName}`}>
        {fade.top && (
          <div
            aria-hidden="true"
            className="task-input-fade-top pointer-events-none absolute left-3 right-5 top-2 z-10 h-3"
          />
        )}
        {fade.bottom && (
          <div
            aria-hidden="true"
            className="task-input-fade-bottom pointer-events-none absolute bottom-2 left-3 right-5 z-10 h-3"
          />
        )}

        <TextareaAutosize
          {...props}
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          ref={setRefs}
          onChange={(event) => {
            setInputLength(event.target.value.length);
            onChange?.(event);
            window.requestAnimationFrame(updateFade);
          }}
          onScroll={(event) => {
            onScroll?.(event);
            updateFade();
          }}
          onHeightChange={(height, meta) => {
            onHeightChange?.(height, meta);
            updateFade();
          }}
          className={`task-input-scrollbar resize-none overflow-y-auto ${className}`}
        />

        {shouldShowLengthWarning && (
          <p className="mt-1 text-sm text-amber-600 dark:text-amber-300">
            {currentLength}/{maxLength} characters
          </p>
        )}
      </div>
    );
  },
);

AutoResizeTextarea.displayName = "AutoResizeTextarea";
