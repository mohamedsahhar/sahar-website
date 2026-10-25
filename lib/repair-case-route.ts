import { prisma } from "@/lib/prisma";

const MIN_SHARED_PREFIX_WORDS = 4;

function slugWords(value: string) {
  return value.toLowerCase().split("-").filter(Boolean);
}

export function decodeCaseSlug(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function selectCaseSlugRedirect(
  requestedSlug: string,
  currentSlugs: string[]
) {
  const requestedWords = slugWords(requestedSlug);
  if (requestedWords.length < MIN_SHARED_PREFIX_WORDS) return null;

  const ranked = currentSlugs
    .map((slug) => {
      const words = slugWords(slug);
      let sharedPrefixWords = 0;
      while (
        sharedPrefixWords < requestedWords.length &&
        sharedPrefixWords < words.length &&
        requestedWords[sharedPrefixWords] === words[sharedPrefixWords]
      ) {
        sharedPrefixWords += 1;
      }
      return { sharedPrefixWords, slug };
    })
    .filter((candidate) => candidate.sharedPrefixWords >= MIN_SHARED_PREFIX_WORDS)
    .sort((left, right) => right.sharedPrefixWords - left.sharedPrefixWords);

  if (!ranked[0] || ranked[1]?.sharedPrefixWords === ranked[0].sharedPrefixWords) {
    return null;
  }

  return ranked[0].slug;
}

export async function findRepairCaseByRequestedSlug(slug: string) {
  const requestedSlug = decodeCaseSlug(slug);
  const include = {
    device: {
      include: { brand: true },
    },
  } as const;

  const exact = await prisma.repairCase.findUnique({
    where: { slug: requestedSlug },
    include,
  });
  if (exact) return { repair: exact, redirected: false };

  const prefix = slugWords(requestedSlug)
    .slice(0, MIN_SHARED_PREFIX_WORDS)
    .join("-");
  if (!prefix) return null;

  const candidates = await prisma.repairCase.findMany({
    where: { slug: { startsWith: prefix } },
    select: { slug: true },
  });
  const currentSlug = selectCaseSlugRedirect(
    requestedSlug,
    candidates.map((candidate) => candidate.slug)
  );
  if (!currentSlug) return null;

  const repair = await prisma.repairCase.findUnique({
    where: { slug: currentSlug },
    include,
  });
  return repair ? { repair, redirected: true } : null;
}
