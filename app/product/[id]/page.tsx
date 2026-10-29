
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";

type Review = {
  _id: string;
  username: string;
  rating: number;
  title: string;
  comment: string;
  photos: string[];
  createdAt: string;
};

type ReviewSummary = {
  averageRating: number;
  totalReviews: number;
  ratingCounts: Record<number, number>;
};

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary>({
    averageRating: 0,
    totalReviews: 0,
    ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });

  const [reviewPage, setReviewPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ratingFilter, setRatingFilter] = useState("");
  const [photosOnly, setPhotosOnly] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const [canReview, setCanReview] = useState(false);
  const [eligibilityChecked, setEligibilityChecked] = useState(false);
  const [existingReview, setExistingReview] = useState<Review | null>(null);

  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [photoUrls, setPhotoUrls] = useState("");

  const trackView = async (productId: string) => {
    try {
      await api.post("/analytics/click", { productId });
    } catch (err) {
      console.log("Analytics error:", err);
    }
  };

  // Load product details and track product views.
  useEffect(() => {
    if (!id) return;

    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.log(err));

    trackView(id);
  }, [id]);

  // Load reviews, rating summary, and pagination.
  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function fetchReviews() {
      setReviewsLoading(true);

      try {
        const res = await api.get(`/reviews/product/${id}`, {
          params: {
            page: reviewPage,
            limit: 5,
            ...(ratingFilter ? { rating: Number(ratingFilter) } : {}),
            ...(photosOnly ? { withPhotos: true } : {}),
          },
        });

        if (cancelled) return;

        setReviews(res.data?.reviews ?? []);
        setSummary({
          averageRating: res.data?.summary?.averageRating ?? 0,
          totalReviews: res.data?.summary?.totalReviews ?? 0,
          ratingCounts: res.data?.summary?.ratingCounts ?? {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
          },
        });
        setTotalPages(
          Math.max(1, res.data?.pagination?.totalPages ?? 1),
        );
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch reviews:", err);
        }
      } finally {
        if (!cancelled) setReviewsLoading(false);
      }
    }

    fetchReviews();

    return () => {
      cancelled = true;
    };
  }, [id, reviewPage, ratingFilter, photosOnly]);

  // Check whether the customer can write or edit a review.
  useEffect(() => {
    if (!id) return;

    const token = localStorage.getItem("token");

    if (!token) {
      setCanReview(false);
      setExistingReview(null);
      setEligibilityChecked(true);
      return;
    }

    let cancelled = false;
    setEligibilityChecked(false);

    api
      .get(`/reviews/product/${id}/eligibility`)
      .then((res) => {
        if (cancelled) return;

        const existing = res.data?.existingReview ?? null;

        setCanReview(Boolean(res.data?.eligible));
        setExistingReview(existing);

        if (existing) {
          setRating(existing.rating);
          setTitle(existing.title ?? "");
          setComment(existing.comment ?? "");
          setPhotoUrls((existing.photos ?? []).join("\n"));
        } else {
          setRating(5);
          setTitle("");
          setComment("");
          setPhotoUrls("");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setCanReview(false);
          setExistingReview(null);
          console.log("Review eligibility check:", err);
        }
      })
      .finally(() => {
        if (!cancelled) setEligibilityChecked(true);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Existing Buy Now and cart logic preserved.
  const handleBuyNow = async () => {
    if (!product) return;

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user?.id && !user?._id) {
      alert("Please login first");
      router.push("/login");
      return;
    }

    const userId = user._id || user.id;

    try {
      await api.post("/cart/add", {
        userId,
        productId: product._id,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        quantity: 1,
      });

      trackView(product._id);
      router.push("/cart");
    } catch (err) {
      console.error("Failed to add product to cart:", err);
      alert("Could not add the product to your cart. Please try again.");
    }
  };

  // Submit a new review or update the customer's existing review.
  const handleSubmitReview = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setReviewMessage("");

    if (!localStorage.getItem("token")) {
      router.push("/login");
      return;
    }

    if (rating < 1 || rating > 5) {
      setReviewMessage("Please select a rating from 1 to 5 stars.");
      return;
    }

    if (!title.trim() || !comment.trim()) {
      setReviewMessage("Please enter a review title and comment.");
      return;
    }

    const photos = photoUrls
      .split("\n")
      .map((url) => url.trim())
      .filter(Boolean);

    if (photos.length > 5) {
      setReviewMessage("You can add up to 5 photo URLs.");
      return;
    }

    setReviewSubmitting(true);

    try {
      const reviewData = {
        rating,
        title: title.trim(),
        comment: comment.trim(),
        photos,
      };

      const response = existingReview
        ? await api.patch(`/reviews/product/${id}`, reviewData)
        : await api.post(`/reviews/product/${id}`, reviewData);

      setExistingReview(response.data);
      setCanReview(true);

      setReviewMessage(
        existingReview
          ? "Your review was updated successfully!"
          : "Your review was submitted successfully!",
      );

      setReviewPage(1);
      setRatingFilter("");
      setPhotosOnly(false);

      const res = await api.get(`/reviews/product/${id}`, {
        params: { page: 1, limit: 5 },
      });

      setReviews(res.data?.reviews ?? []);
      setSummary({
        averageRating: res.data?.summary?.averageRating ?? 0,
        totalReviews: res.data?.summary?.totalReviews ?? 0,
        ratingCounts: res.data?.summary?.ratingCounts ?? {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
        },
      });
      setTotalPages(
        Math.max(1, res.data?.pagination?.totalPages ?? 1),
      );
    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        "Could not save your review. Please try again.";

      setReviewMessage(
        Array.isArray(message) ? message.join(", ") : message,
      );
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Display read-only stars for product and customer reviews.
  const renderStars = (value: number, size = "text-lg") => (
    <span
      className={`${size} tracking-wide`}
      aria-label={`${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={
            star <= Math.round(value)
              ? "text-amber-400"
              : "text-gray-300 dark:text-gray-600"
          }
        >
          ★
        </span>
      ))}
    </span>
  );

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
        <div className="text-center">
          <div className="mx-auto mb-3 h-9 w-9 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600" />
          <p className="text-sm text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 text-gray-900 dark:bg-gray-950 dark:text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mb-5 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-pink-600 transition hover:bg-pink-50 hover:text-pink-700 dark:hover:bg-gray-900"
        >
          <span aria-hidden="true">←</span>
          Back to shopping
        </button>

        {/* Product details */}
        <section className="grid gap-7 overflow-hidden rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:grid-cols-2 sm:p-8">
          <div className="overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
            <img
              src={product.image}
              alt={product.name}
              className="h-72 w-full object-cover transition duration-500 hover:scale-105 sm:h-96"
            />
          </div>

          <div className="flex flex-col items-start py-1">
            <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-pink-700 dark:bg-pink-950 dark:text-pink-300">
              Product details
            </span>

            <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              {product.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {renderStars(summary.averageRating)}
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {summary.averageRating.toFixed(1)} · {summary.totalReviews}{" "}
                {summary.totalReviews === 1 ? "review" : "reviews"}
              </span>
            </div>

            <p className="mt-5 whitespace-pre-line text-sm leading-7 text-gray-600 dark:text-gray-300">
              {product.description}
            </p>

            <p className="mt-6 text-3xl font-bold text-pink-600">
              Rs. {product.price}
            </p>

            <button
              type="button"
              onClick={handleBuyNow}
              className="mt-6 w-full rounded-xl bg-pink-600 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-pink-700 hover:shadow-md active:translate-y-0 sm:w-auto"
            >
              Buy Now
            </button>
          </div>
        </section>

        {/* Rating summary */}
        <section className="mt-8 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-pink-600">
              Customer feedback
            </p>
            <h2 className="mt-1 text-2xl font-bold">Ratings & Reviews</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              See what customers think about this product.
            </p>
          </div>

          <div className="mt-7 grid gap-7 sm:grid-cols-[190px_1fr]">
            <div className="flex flex-col items-center justify-center rounded-2xl bg-amber-50 p-5 text-center dark:bg-gray-800">
              <p className="text-5xl font-bold tracking-tight">
                {summary.averageRating.toFixed(1)}
              </p>
              <div className="mt-2">
                {renderStars(summary.averageRating, "text-xl")}
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {summary.totalReviews} customer{" "}
                {summary.totalReviews === 1 ? "review" : "reviews"}
              </p>
            </div>

            <div className="flex flex-col justify-center space-y-3">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = summary.ratingCounts[star] ?? 0;
                const percent = summary.totalReviews
                  ? (count / summary.totalReviews) * 100
                  : 0;

                return (
                  <div
                    key={star}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span className="w-12 shrink-0 font-medium">
                      {star} ★
                    </span>
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                      <div
                        className="h-full rounded-full bg-amber-400 transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-gray-500 dark:text-gray-400">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Review filters and list */}
        <section className="mt-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold">Customer Reviews</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Honest feedback from customers.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={ratingFilter}
                onChange={(e) => {
                  setRatingFilter(e.target.value);
                  setReviewPage(1);
                }}
                aria-label="Filter reviews by rating"
                className="rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                <option value="">All ratings</option>
                {[5, 4, 3, 2, 1].map((star) => (
                  <option key={star} value={star}>
                    {star} stars
                  </option>
                ))}
              </select>

              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-300 px-3 py-2.5 text-sm dark:border-gray-700">
                <input
                  type="checkbox"
                  checked={photosOnly}
                  onChange={(e) => {
                    setPhotosOnly(e.target.checked);
                    setReviewPage(1);
                  }}
                  className="accent-pink-600"
                />
                With photos
              </label>
            </div>
          </div>

          {reviewsLoading ? (
            <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-gray-900">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600" />
              <p className="text-sm text-gray-500">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-900">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-pink-50 text-2xl text-pink-600 dark:bg-pink-950">
                ★
              </div>
              <p className="mt-4 font-semibold">No reviews found</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try changing the filters, or be the first to share your
                experience.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {reviews.map((review) => (
                <article
                  key={review._id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900 sm:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pink-100 text-lg font-bold text-pink-700 dark:bg-pink-950 dark:text-pink-300">
                        {(review.username || "C").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {review.username || "Customer"}
                        </p>
                        <div className="mt-0.5">
                          {renderStars(review.rating, "text-base")}
                        </div>
                      </div>
                    </div>

                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-bold">{review.title}</h3>
                  <p className="mt-2 whitespace-pre-line text-sm leading-7 text-gray-600 dark:text-gray-300">
                    {review.comment}
                  </p>

                  {review.photos?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {review.photos.map((photo, index) => (
                        <a
                          key={`${photo}-${index}`}
                          href={photo}
                          target="_blank"
                          rel="noreferrer"
                          className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700"
                        >
                          <img
                            src={photo}
                            alt={`Review photo ${index + 1}`}
                            className="h-24 w-24 object-cover transition duration-300 hover:scale-105"
                          />
                        </a>
                      ))}
                    </div>
                  )}
                </article>
              ))}

              <div className="flex items-center justify-center gap-4 py-5">
                <button
                  type="button"
                  disabled={reviewPage <= 1}
                  onClick={() => setReviewPage((page) => page - 1)}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  ← Previous
                </button>

                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Page {reviewPage} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={reviewPage >= totalPages}
                  onClick={() => setReviewPage((page) => page + 1)}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Review form */}
        <section className="mt-8 overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="border-b border-pink-100 bg-gradient-to-r from-pink-50 to-amber-50 px-5 py-6 dark:border-gray-800 dark:from-gray-900 dark:to-gray-800 sm:px-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-pink-600">
              Your experience matters
            </p>
            <h2 className="mt-1 text-2xl font-bold">
              {existingReview ? "Edit Your Review" : "Write a Review"}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {existingReview
                ? "Update your rating, comments, or photos below."
                : "Share your experience and help other customers."}
            </p>
          </div>

          <div className="p-5 sm:p-8">
            {!eligibilityChecked ? (
              <p className="py-5 text-sm text-gray-500">
                Checking review options...
              </p>
            ) : canReview ? (
              <form onSubmit={handleSubmitReview} className="space-y-6">
                {/* Interactive star rating */}
                <div>
                  <label className="mb-3 block text-sm font-semibold">
                    Your rating
                  </label>

                  <div
                    className="inline-flex items-center gap-1 rounded-2xl bg-amber-50 px-4 py-3 dark:bg-gray-800"
                    role="radiogroup"
                    aria-label="Choose rating"
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = star <= (hoverRating || rating);

                      return (
                        <button
                          key={star}
                          type="button"
                          role="radio"
                          aria-checked={rating === star}
                          aria-label={`Rate ${star} out of 5 stars`}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onFocus={() => setHoverRating(star)}
                          onBlur={() => setHoverRating(0)}
                          className="rounded-md text-3xl leading-none transition duration-150 hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
                        >
                          <span
                            className={
                              active
                                ? "text-amber-400 drop-shadow-sm"
                                : "text-gray-300 dark:text-gray-600"
                            }
                          >
                            ★
                          </span>
                        </button>
                      );
                    })}

                    <span className="ml-3 min-w-12 text-sm font-bold text-gray-700 dark:text-gray-200">
                      {hoverRating || rating}/5
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Click a star to select your rating.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="review-title"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Review title
                  </label>
                  <input
                    id="review-title"
                    required
                    minLength={1}
                    maxLength={100}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Summarize your experience"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-pink-950"
                  />
                </div>

                <div>
                  <label
                    htmlFor="review-comment"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Your review
                  </label>
                  <textarea
                    id="review-comment"
                    required
                    minLength={1}
                    maxLength={2000}
                    rows={5}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What did you like or dislike about this product?"
                    className="w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-pink-950"
                  />
                  <p className="mt-1 text-right text-xs text-gray-500">
                    {comment.length}/2000
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="review-photos"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Photo URLs
                    <span className="ml-2 font-normal text-gray-500">
                      (optional, up to 5)
                    </span>
                  </label>
                  <textarea
                    id="review-photos"
                    rows={3}
                    value={photoUrls}
                    onChange={(e) => setPhotoUrls(e.target.value)}
                    placeholder={"Paste one image URL per line"}
                    className="w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-pink-950"
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Add one image URL per line. Direct file uploads are not
                    supported by this form.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-pink-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {reviewSubmitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Saving...
                    </>
                  ) : existingReview ? (
                    "Update Review"
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </form>
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800">
                {!localStorage.getItem("token") ? (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Please log in with your customer account to write a
                      review.
                    </p>
                    <button
                      type="button"
                      onClick={() => router.push("/login")}
                      className="mt-4 rounded-xl bg-pink-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-700"
                    >
                      Log in to review
                    </button>
                  </>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Review submission is available to customer accounts. You
                    can still browse and read all product reviews.
                  </p>
                )}
              </div>
            )}

            {reviewMessage && (
              <p
                role="status"
                className={`mt-5 rounded-xl border p-4 text-sm ${
                  reviewMessage.toLowerCase().includes("successfully")
                    ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300"
                    : "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
                }`}
              >
                {reviewMessage}
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
