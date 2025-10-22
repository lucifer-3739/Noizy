export function FAQ() {
  const faqs = [
    {
      question: "Do you support high-resolution audio?",
      answer:
        "Yes—lossless streaming is included in Pro with up to 24-bit depth.",
    },
    {
      question: "Can I listen offline?",
      answer: "Save albums and playlists for offline playback with one tap.",
    },
    {
      question: "How does collaboration work?",
      answer:
        "Invite friends to a shared playlist and add tracks live—like a group chat for music.",
    },
    {
      question: "Which platforms are supported?",
      answer: "iOS, Android, and the web app in all modern browsers.",
    },
  ];

  return (
    <section id="faq" className="mt-16 sm:mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Frequently asked questions
          </h2>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 bg-white/30 dark:bg-zinc-900/20 backdrop-blur-xl"
            >
              <h3 className="text-base font-semibold tracking-tight">
                {faq.question}
              </h3>
              <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
