import type { Policy } from "@/lib/policies";

type PolicyPageProps = {
  policy: Policy;
};

export function PolicyPage({ policy }: PolicyPageProps) {
  return (
    <div className="container-shell py-8 sm:py-10">
      <article className="surface mx-auto max-w-4xl p-5 sm:p-8">
        <p className="text-sm font-semibold text-[var(--gold)]">
          Last updated: {policy.updatedAt}
        </p>
        <h1 className="mt-3 text-3xl font-black text-[var(--brown)] sm:text-4xl">
          {policy.title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
          {policy.description}
        </p>

        <div className="mt-8 grid gap-7">
          {policy.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-black text-[var(--brown)]">
                {section.title}
              </h2>
              {section.body?.map((paragraph) => (
                <p key={paragraph} className="mt-3 leading-7 text-[var(--foreground)]">
                  {paragraph}
                </p>
              ))}
              {section.items && (
                <ul className="mt-3 grid gap-2 pl-5 leading-7 text-[var(--foreground)]">
                  {section.items.map((item) => (
                    <li key={item} className="list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
