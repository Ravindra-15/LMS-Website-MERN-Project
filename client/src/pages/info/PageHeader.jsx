// Shared banner used at the top of the footer pages (About, Contact, Privacy).
// Uses the same blue/indigo gradient as the home hero, with a dark-mode variant.
const PageHeader = ({ eyebrow, title, subtitle }) => {
  return (
    <section className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-16 md:py-20 text-center">
      <div className="max-w-3xl mx-auto space-y-4">
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-widest text-yellow-300">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl md:text-5xl font-extrabold text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base md:text-lg text-gray-200/90 dark:text-gray-300">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
};

export default PageHeader;
