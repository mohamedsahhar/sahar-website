type SearchExpansion = {
  normalized: string;
  compact: string;
  tokens: string[];
};

const SPACE_LIKE_REGEX = /[\s\u00A0\u2000-\u200D\u202F\u205F\u3000]+/g;
const NON_SEARCH_CHARS_REGEX = /[^\p{L}\p{N}\s]+/gu;
const LETTER_NUMBER_BOUNDARY_REGEX =
  /(?<=\p{L})(?=\p{N})|(?<=\p{N})(?=\p{L})/gu;

function normalizeArabicCharacters(value: string) {
  return value
    .replace(/[\u0623\u0625\u0622]/g, "\u0627")
    .replace(/\u0649/g, "\u064A")
    .replace(/\u0629/g, "\u0647");
}

function levenshteinDistance(a: string, b: string) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  const current = new Array<number>(b.length + 1);

  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i;

    for (let j = 1; j <= b.length; j += 1) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;

      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + substitutionCost
      );
    }

    for (let j = 0; j <= b.length; j += 1) {
      previous[j] = current[j];
    }
  }

  return previous[b.length];
}

function splitTokenVariants(token: string) {
  return token
    .split(LETTER_NUMBER_BOUNDARY_REGEX)
    .map((part) => part.trim())
    .filter(Boolean);
}

function getTypoTolerance(token: string) {
  if (token.length <= 2) return 0;
  if (token.length <= 5) return 1;
  return 2;
}

function tokenMatches(
  queryToken: string,
  targetTokens: string[],
  targetCompact: string
) {
  if (!queryToken) return true;

  if (targetCompact.includes(queryToken)) {
    return true;
  }

  const queryVariants = [queryToken, ...splitTokenVariants(queryToken)];
  const uniqueQueryVariants = [...new Set(queryVariants)];

  for (const variant of uniqueQueryVariants) {
    if (!variant) continue;

    if (targetCompact.includes(variant)) {
      continue;
    }

    const tolerance = getTypoTolerance(variant);
    const matchedTargetToken = targetTokens.some((targetToken) => {
      if (targetToken.includes(variant) || variant.includes(targetToken)) {
        return true;
      }

      if (Math.abs(targetToken.length - variant.length) > tolerance) {
        return false;
      }

      return levenshteinDistance(variant, targetToken) <= tolerance;
    });

    if (!matchedTargetToken) {
      return false;
    }
  }

  return true;
}

export function normalizeSearchText(input: string) {
  return normalizeArabicCharacters(input)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(NON_SEARCH_CHARS_REGEX, " ")
    .replace(SPACE_LIKE_REGEX, " ")
    .trim();
}

export function expandSearchText(input: string): SearchExpansion {
  const normalized = normalizeSearchText(input);
  const compact = normalized.replace(/ /g, "");
  const rawTokens = normalized ? normalized.split(" ") : [];
  const splitTokens = rawTokens.flatMap(splitTokenVariants);
  const tokens = [...new Set([...rawTokens, ...splitTokens].filter(Boolean))];

  return {
    normalized,
    compact,
    tokens,
  };
}

export function isSmartSearchMatch(query: string, target: string) {
  const expandedQuery = expandSearchText(query);

  if (!expandedQuery.normalized) {
    return true;
  }

  const expandedTarget = expandSearchText(target);

  if (!expandedTarget.normalized) {
    return false;
  }

  if (
    expandedTarget.normalized.includes(expandedQuery.normalized) ||
    expandedTarget.compact.includes(expandedQuery.compact)
  ) {
    return true;
  }

  return expandedQuery.tokens.every((token) =>
    tokenMatches(token, expandedTarget.tokens, expandedTarget.compact)
  );
}
