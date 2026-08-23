import {
  englishAuthorHref,
  englishWorkHref
} from "../lib/english-catalog";
import {
  getEnglishAuthorCollection,
  getEnglishWorkCollection,
  getPublishedEnglishAuthors,
  getPublishedEnglishWorks
} from "../lib/english-catalog.server";
import { ENGLISH_CLASSICS } from "../lib/english-classics-wave2";

const failures: string[] = [];
const authors = getPublishedEnglishAuthors();
const works = getPublishedEnglishWorks();

if (authors.length < 10) failures.push(`Expected at least 10 substantial author collections, received ${authors.length}.`);
if (works.length < 10) failures.push(`Expected at least 10 substantial source collections, received ${works.length}.`);

for (const slug of ["li-bai", "su-shi", "wang-wei", "du-fu", "confucius", "laozi", "mencius", "xunzi", "zhuangzi", "han-yu"]) {
  const author = getEnglishAuthorCollection(slug);
  if (!author) failures.push(`Missing expected author collection: ${slug}`);
  else if (author.items.length < 2) failures.push(`Author collection is too thin: ${slug}`);
}

for (const slug of ["book-of-songs", "analects", "tao-te-ching", "mencius", "xunzi", "zhuangzi", "complete-tang-poems", "records-of-the-grand-historian", "strategies-of-the-warring-states", "book-of-rites"]) {
  const work = getEnglishWorkCollection(slug);
  if (!work) failures.push(`Missing expected source collection: ${slug}`);
  else if (work.items.length < 2) failures.push(`Source collection is too thin: ${slug}`);
}

for (const author of authors) {
  if (author.items.length < 2) failures.push(`Published author has fewer than two entries: ${author.slug}`);
  if (new Set(author.items.map((item) => item.id)).size !== author.items.length) failures.push(`Duplicate entry in author collection: ${author.slug}`);
  if (author.items.some((item) => englishAuthorHref(item.authorEn) !== author.href)) failures.push(`Author link mismatch in collection: ${author.slug}`);
}

for (const work of works) {
  if (work.items.length < 2) failures.push(`Published source has fewer than two entries: ${work.slug}`);
  if (new Set(work.items.map((item) => item.id)).size !== work.items.length) failures.push(`Duplicate entry in source collection: ${work.slug}`);
  if (work.items.some((item) => englishWorkHref(item.sourceEn) !== work.href)) failures.push(`Source link mismatch in collection: ${work.slug}`);
}

for (const item of ENGLISH_CLASSICS) {
  const authorHref = englishAuthorHref(item.authorEn);
  if (authorHref) {
    const slug = authorHref.split("/").pop() ?? "";
    const collection = getEnglishAuthorCollection(slug);
    if (!collection?.items.some((entry) => entry.id === item.id)) failures.push(`Author page does not contain linked entry: ${item.id}`);
  }

  const workHref = englishWorkHref(item.sourceEn);
  if (workHref) {
    const slug = workHref.split("/").pop() ?? "";
    const collection = getEnglishWorkCollection(slug);
    if (!collection?.items.some((entry) => entry.id === item.id)) failures.push(`Source page does not contain linked entry: ${item.id}`);
  }
}

if (failures.length > 0) {
  console.error("English catalog checks failed:\n" + failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`English catalog checks passed: ${authors.length} authors, ${works.length} source collections, ${ENGLISH_CLASSICS.length} classics checked.`);
