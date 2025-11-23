import * as React from "react";
import { Checkbox } from "~/common/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "~/common/components/ui/field";
import { Button } from "~/common/components/ui/button";

export type SurveyOption = {
  id: string;
  label: string;
  value?: string;
};

export type SurveySection = {
  id: string;
  title: string;
  description?: string;
  options: SurveyOption[];
  multiple?: boolean;
};

export type ChatInitFormProps = {
  sections: SurveySection[];
  submitLabel?: string;
  onSubmit?: (values: Record<string, string[]>) => void | Promise<void>;
  className?: string;
  actionData?: { success?: boolean; ok?: boolean; error?: string };
};

export function ChatInitForm({
  sections,
  submitLabel = "다음",
  onSubmit,
  className,
  actionData,
}: ChatInitFormProps) {
  const [selected, setSelected] = React.useState<Record<string, string[]>>({});

  // Form 리셋 패턴: actionData가 성공이면 선택 상태 리셋
  React.useEffect(() => {
    if (actionData?.success || actionData?.ok) {
      setSelected({});
    }
  }, [actionData?.success, actionData?.ok]);

  const toggle = (sectionId: string, optionId: string, multiple?: boolean) => {
    setSelected((prev) => {
      const current = prev[sectionId] ?? [];
      if (multiple) {
        const exists = current.includes(optionId);
        return {
          ...prev,
          [sectionId]: exists
            ? current.filter((x) => x !== optionId)
            : [...current, optionId],
        };
      }
      // single-select: replace with only this option
      return {
        ...prev,
        [sectionId]: current.includes(optionId) ? [] : [optionId],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) await onSubmit(selected);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="w-full rounded-lg border p-3 bg-background/60 backdrop-blur">
        <FieldGroup>
          {sections.map((section, index) => (
            <React.Fragment key={section.id}>
              <FieldSet>
                <FieldLegend variant="label">{section.title}</FieldLegend>
                {section.description ? (
                  <FieldDescription>{section.description}</FieldDescription>
                ) : null}
                <FieldGroup className="gap-3">
                  {section.options.map((opt) => {
                    const checked = (selected[section.id] ?? []).includes(
                      opt.id
                    );
                    return (
                      <Field key={opt.id} orientation="horizontal">
                        <Checkbox
                          id={`survey-${section.id}-${opt.id}`}
                          checked={checked}
                          onCheckedChange={() =>
                            toggle(section.id, opt.id, section.multiple)
                          }
                        />
                        <FieldLabel
                          htmlFor={`survey-${section.id}-${opt.id}`}
                          className="font-normal"
                        >
                          {opt.label}
                        </FieldLabel>
                      </Field>
                    );
                  })}
                </FieldGroup>
              </FieldSet>
              {index < sections.length - 1 ? <FieldSeparator /> : null}
            </React.Fragment>
          ))}
        </FieldGroup>
        <div className="mt-3 flex justify-end">
          <Button size="sm" className="rounded-full" type="submit">
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default ChatInitForm;
