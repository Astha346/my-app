"use client";

import Link from "next/link";
import {
  HelpCircle,
  Package,
  ShoppingCart,
  CreditCard,
  RotateCcw,
  User,
  MapPin,
  MessageCircle,
  Mail,
  ChevronDown,
  ArrowLeft,
  Search,
  X,
  ShieldCheck,
  Truck,
  Heart,
  Headphones,
} from "lucide-react";
import {
  useMemo,
  useState,
  type KeyboardEvent,
} from "react";

const faqs = [
  // =========================
  // ORDERS
  // =========================
  {
    category: "Orders",
    question: "How can I track my order?",
    answer:
      "You can track your order from the My Orders section of your account. Open an order to view its current status.",
  },
  {
    category: "Orders",
    question: "How can I cancel my order?",
    answer:
      "Open My Orders, select the order you want to cancel, and use the cancel option if the order is still eligible for cancellation.",
  },
  {
    category: "Orders",
    question: "How can I change my order?",
    answer:
      "If your order has not been processed yet, contact support as soon as possible to ask whether changes can be made.",
  },
  {
    category: "Orders",
    question: "Where can I see my previous orders?",
    answer:
      "You can view your previous orders from the My Orders section of your account.",
  },
  {
    category: "Orders",
    question: "What do the different order statuses mean?",
    answer:
      "Pending means the order is waiting for confirmation. Confirmed means the order has been accepted. Processing means it is being prepared. Shipped means it has been handed to delivery. Delivered means the order has reached you. Cancelled means the order was cancelled.",
  },
  {
    category: "Orders",
    question: "What should I do if my order has not arrived?",
    answer:
      "First check the latest order status in My Orders. If the expected delivery time has passed, contact support with your order details.",
  },

  // =========================
  // PAYMENT
  // =========================
  {
    category: "Payments",
    question: "What payment methods are available?",
    answer:
      "You can pay using Cash on Delivery, eSewa, or Khalti, depending on the options available during checkout.",
  },
  {
    category: "Payments",
    question: "Can I pay using Cash on Delivery?",
    answer:
      "Yes, Cash on Delivery is available for eligible orders.",
  },
  {
    category: "Payments",
    question: "What should I do if my online payment fails?",
    answer:
      "Check your payment details and try again. If the problem continues, contact support and provide your order and payment information.",
  },
  {
    category: "Payments",
    question: "What if I was charged but my order was not created?",
    answer:
      "Do not make another payment immediately. Contact support with your payment transaction details so the payment can be checked.",
  },
  {
    category: "Payments",
    question: "Can I change my payment method after placing an order?",
    answer:
      "Payment methods generally cannot be changed after an order is placed. Contact support as soon as possible if you need assistance.",
  },
  {
    category: "Payments",
    question: "Are online payments secure?",
    answer:
      "Payments are processed through the available payment providers. Never share your password, OTP, or other sensitive payment information with anyone.",
  },

  // =========================
  // DELIVERY
  // =========================
  {
    category: "Delivery",
    question: "How long does delivery take?",
    answer:
      "Delivery time depends on your location, product availability, and delivery conditions. You can check your order status from My Orders.",
  },
  {
    category: "Delivery",
    question: "Where do you deliver?",
    answer:
      "Delivery availability depends on the address entered during checkout. Enter your delivery address to check whether delivery is available.",
  },
  {
    category: "Delivery",
    question: "How can I change my delivery address?",
    answer:
      "You can manage your saved delivery addresses from the address section of your account. For an existing order, contact support as soon as possible.",
  },
  {
    category: "Delivery",
    question: "Can I save multiple delivery addresses?",
    answer:
      "Yes, you can manage your saved addresses from the Saved Addresses section of your account.",
  },
  {
    category: "Delivery",
    question: "What happens if I am unavailable when my order arrives?",
    answer:
      "The delivery process may depend on the courier and local delivery conditions. Contact support if you need help arranging another delivery attempt.",
  },
  {
    category: "Delivery",
    question: "Can I provide a different delivery address for each order?",
    answer:
      "Yes, you can select or enter the appropriate delivery address during checkout when available.",
  },

  // =========================
  // CART
  // =========================
  {
    category: "Cart",
    question: "How do I add a product to my cart?",
    answer:
      "Open the product and click Add to Cart. The product will be added to your shopping cart.",
  },
  {
    category: "Cart",
    question: "How do I remove a product from my cart?",
    answer:
      "Open your cart and use the remove option next to the product you want to remove.",
  },
  {
    category: "Cart",
    question: "Can I change the quantity of a product?",
    answer:
      "Yes, you can increase or decrease the quantity of eligible products directly from your cart.",
  },
  {
    category: "Cart",
    question: "Why is my cart empty?",
    answer:
      "Your cart may be empty because no products have been added or because the cart was cleared. Add products again from the product pages.",
  },
  {
    category: "Cart",
    question: "Can I add multiple products to my cart?",
    answer:
      "Yes, you can add multiple different products to your cart before proceeding to checkout.",
  },
  {
    category: "Cart",
    question: "Can I buy multiple quantities of the same product?",
    answer:
      "Yes, if the product has enough stock available, you can increase its quantity from the cart.",
  },

  // =========================
  // WISHLIST / PRODUCTS
  // =========================
  {
    category: "Products",
    question: "How do I add a product to my wishlist?",
    answer:
      "Click the heart icon on a product to add it to your wishlist.",
  },
  {
    category: "Products",
    question: "How do I remove a product from my wishlist?",
    answer:
      "Open your wishlist and click the heart icon on the product you want to remove.",
  },
  {
    category: "Products",
    question: "Can I move a wishlist product to my cart?",
    answer:
      "Yes, when the product is available, you can add it to your cart from your wishlist or product page.",
  },
  {
    category: "Products",
    question: "How can I search for a product?",
    answer:
      "Use the search bar in the navigation area and enter the product name or keyword you are looking for.",
  },
  {
    category: "Products",
    question: "How can I browse products by category?",
    answer:
      "Use the category navigation or category sections to browse products grouped by category.",
  },
  {
    category: "Products",
    question: "How can I know if a product is in stock?",
    answer:
      "Product availability is shown on the product page. If a product is out of stock, you may not be able to add it to your cart.",
  },
  {
    category: "Products",
    question: "Why can't I add a product to my cart?",
    answer:
      "The product may be out of stock or temporarily unavailable. Refresh the page and try again. If the problem continues, contact support.",
  },

  // =========================
  // RETURNS
  // =========================
  {
    category: "Returns",
    question: "What products are eligible for return?",
    answer:
      "Return eligibility can depend on the product and its condition. Check the return information associated with your order or contact support.",
  },
  {
    category: "Returns",
    question: "How can I request a return?",
    answer:
      "Open your order and check whether the product is eligible for return. If eligible, submit a return request or contact support.",
  },
  {
    category: "Returns",
    question: "What should I do if I receive a damaged product?",
    answer:
      "Contact support as soon as possible and provide your order details and information about the damaged product.",
  },
  {
    category: "Returns",
    question: "What happens after I submit a return request?",
    answer:
      "Your return request will be reviewed. You may be contacted if additional information is required before the return is processed.",
  },
  {
    category: "Returns",
    question: "How long does a refund take?",
    answer:
      "Refund timing can depend on the payment method and processing conditions. Contact support if your refund is taking longer than expected.",
  },
  {
    category: "Returns",
    question: "Can I return a product after using it?",
    answer:
      "Return eligibility may depend on the product condition and applicable return requirements. Contact support before returning the product.",
  },

  // =========================
  // ACCOUNT
  // =========================
  {
    category: "Account",
    question: "How do I create an account?",
    answer:
      "Use the registration option and provide the required information to create your ShopEase account.",
  },
  {
    category: "Account",
    question: "How can I update my profile?",
    answer:
      "Open your account profile and update the information you want to change.",
  },
  {
    category: "Account",
    question: "How can I change my password?",
    answer:
      "Open your account settings and use the password change option if it is available.",
  },
  {
    category: "Account",
    question: "What should I do if I forget my password?",
    answer:
      "Use the available password recovery option on the login page. If you cannot recover your account, contact support.",
  },
  {
    category: "Account",
    question: "How do I log out of my account?",
    answer:
      "Open the account menu and select Logout.",
  },
  {
    category: "Account",
    question: "Can I update my email address?",
    answer:
      "If your account settings allow email changes, update it from your profile. Otherwise, contact support for assistance.",
  },

  // =========================
  // CHECKOUT
  // =========================
  {
    category: "Orders",
    question: "How do I place an order?",
    answer:
      "Add your products to the cart, open the cart, proceed to checkout, enter your delivery details, select a payment method, and confirm your order.",
  },
  {
    category: "Orders",
    question: "Can I review my order before placing it?",
    answer:
      "Yes. Review your products, quantities, delivery address, payment method, and total amount before confirming the order.",
  },
  {
    category: "Payments",
    question: "Why is checkout not working?",
    answer:
      "Check your delivery information, cart items, payment method, and internet connection. If the issue continues, contact support.",
  },

  // =========================
  // SUPPORT
  // =========================
  {
    category: "Support",
    question: "How can I contact support?",
    answer:
      "You can contact our support team using the email options provided in the support section below.",
  },
  {
    category: "Support",
    question: "What information should I provide to support?",
    answer:
      "Provide your order number, account email, a clear description of the problem, and any relevant screenshots or payment details.",
  },
  {
    category: "Support",
    question: "How quickly will support respond?",
    answer:
      "Response time can vary depending on the number and type of requests. Provide complete information so your issue can be handled efficiently.",
  },
  {
    category: "Support",
    question: "Can support help with an order problem?",
    answer:
      "Yes. Contact support with your order number and a description of the issue so the order can be checked.",
  },
];

const helpTopics = [
  {
    title: "Orders",
    description: "Track, cancel and manage your orders",
    href: "/orders",
    icon: Package,
  },
  {
    title: "Cart",
    description: "Manage products in your shopping cart",
    href: "/cart",
    icon: ShoppingCart,
  },
  {
    title: "Payments",
    description: "Learn about payment options",
    href: "/checkout",
    icon: CreditCard,
  },
  {
    title: "Returns & Refunds",
    description: "Learn about returns and refunds",
    href: "/orders",
    icon: RotateCcw,
  },
  {
    title: "My Account",
    description: "Manage your profile and settings",
    href: "/account",
    icon: User,
  },
  {
    title: "Delivery Address",
    description: "Manage your saved addresses",
    href: "/addresses",
    icon: MapPin,
  },
];

const faqCategories = [
  "All",
  "Orders",
  "Payments",
  "Delivery",
  "Returns",
  "Account",
  "Cart",
  "Products",
  "Support",
];

const popularQuestions = [
  "How can I track my order?",
  "What payment methods are available?",
  "How can I change my delivery address?",
  "What should I do if I receive a damaged product?",
];

export default function HelpPage() {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSearch = () => {
    const value = searchInput.trim();

    setSearchTerm(value);
    setOpenFaq(null);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    setOpenFaq(null);
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearchTerm("");
    setSelectedCategory("All");
    setOpenFaq(null);
  };

  const filteredFaqs = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return faqs.filter((faq) => {
      const matchesCategory =
        selectedCategory === "All" ||
        faq.category === selectedCategory;

      const matchesSearch =
        !search ||
        faq.question.toLowerCase().includes(search) ||
        faq.answer.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const openPopularQuestion = (question: string) => {
    const index = faqs.findIndex(
      (faq) => faq.question === question
    );

    if (index === -1) return;

    setSearchInput("");
    setSearchTerm("");
    setSelectedCategory("All");
    setOpenFaq(index);

    setTimeout(() => {
      document
        .getElementById(`faq-${index}`)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }, 100);
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* =========================================
          HERO
      ========================================= */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-linear-to-b from-pink-50 via-white to-white">
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-pink-200/30 blur-3xl" />
        <div className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-purple-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-pink-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
          </Link>

          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 shadow-sm">
              <HelpCircle className="h-8 w-8" />
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              How can we help?
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              Find answers to common questions about orders,
              payments, delivery, returns, and your account.
            </p>

            {/* SEARCH */}
            <div className="mx-auto mt-8 flex max-w-2xl items-center rounded-2xl border border-gray-200 bg-white p-2 shadow-lg shadow-gray-100">
              <Search className="ml-3 h-5 w-5 shrink-0 text-gray-400" />

              <input
                type="text"
                value={searchInput}
                onChange={(event) =>
                  setSearchInput(event.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Search your question..."
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-gray-400 sm:text-base"
              />

              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="mr-1 rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              <button
                type="button"
                onClick={handleSearch}
                className="rounded-xl bg-pink-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-700"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          MAIN CONTENT
      ========================================= */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">

        {/* =========================================
            HELP TOPICS
        ========================================= */}
        <div className="mb-16">
          <div className="mb-7">
            <p className="text-sm font-semibold uppercase tracking-wider text-pink-600">
              Quick Help
            </p>

            <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              What do you need help with?
            </h2>

            <p className="mt-2 text-gray-500">
              Quickly find the section you need.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {helpTopics.map((topic) => {
              const Icon = topic.icon;

              return (
                <Link
                  key={topic.title}
                  href={topic.href}
                  className="group rounded-2xl border border-gray-200 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-lg hover:shadow-pink-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-50 text-pink-600 transition group-hover:bg-pink-100">
                      <Icon className="h-6 w-6" />
                    </div>

                    <span className="text-xl text-gray-300 transition group-hover:translate-x-1 group-hover:text-pink-500">
                      →
                    </span>
                  </div>

                  <h3 className="mt-5 font-semibold text-gray-900">
                    {topic.title}
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    {topic.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* =========================================
            POPULAR QUESTIONS
        ========================================= */}
        <div className="mb-14">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-pink-600">
              Quick Answers
            </p>

            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              Popular Questions
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Jump directly to some of the questions customers ask most often.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {popularQuestions.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() =>
                  openPopularQuestion(question)
                }
                className="group flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-pink-300 hover:shadow-md hover:shadow-pink-50"
              >
                <span className="pr-4 text-sm font-medium leading-6 text-gray-700 transition group-hover:text-pink-600">
                  {question}
                </span>

                <span className="shrink-0 text-lg text-gray-300 transition group-hover:translate-x-1 group-hover:text-pink-500">
                  →
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* =========================================
            FAQ SECTION
        ========================================= */}
        <div id="faq-section">
          {/* TITLE */}
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-pink-600">
              FAQ
            </p>

            <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Frequently Asked Questions
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Find answers to common questions.
                </p>
              </div>

              <p className="text-sm font-medium text-gray-500">
                {filteredFaqs.length}{" "}
                {filteredFaqs.length === 1
                  ? "question"
                  : "questions"}{" "}
                found
              </p>
            </div>
          </div>

          {/* =========================================
              CATEGORY FILTER
          ========================================= */}
          <div className="mb-8 overflow-x-auto pb-2">
            <div className="flex min-w-max gap-2">
              {faqCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(category);
                    setOpenFaq(null);
                  }}
                  className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                    selectedCategory === category
                      ? "bg-pink-600 text-white shadow-md shadow-pink-200"
                      : "border border-gray-200 bg-white text-gray-600 hover:border-pink-300 hover:text-pink-600"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* ACTIVE FILTER */}
          {(searchTerm || selectedCategory !== "All") && (
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-pink-100 bg-pink-50 px-4 py-3">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-medium text-gray-700">
                  Filters:
                </span>

                {selectedCategory !== "All" && (
                  <span className="rounded-full bg-white px-3 py-1 font-medium text-pink-600">
                    {selectedCategory}
                  </span>
                )}

                {searchTerm && (
                  <span className="rounded-full bg-white px-3 py-1 font-medium text-pink-600">
                    "{searchTerm}"
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-semibold text-pink-600 hover:text-pink-700"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* =========================================
              FAQ LIST
          ========================================= */}
          {filteredFaqs.length > 0 ? (
            <div className="space-y-3">
              {filteredFaqs.map((faq) => {
                const originalIndex = faqs.indexOf(faq);
                const isOpen = openFaq === originalIndex;

                return (
                  <div
                    key={faq.question}
                    id={`faq-${originalIndex}`}
                    className={`overflow-hidden rounded-2xl border transition ${
                      isOpen
                        ? "border-pink-200 bg-pink-50/40 shadow-sm"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaq(
                          isOpen ? null : originalIndex
                        )
                      }
                      className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                    >
                      <div className="flex min-w-0 items-start gap-4">
                        <div
                          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                            isOpen
                              ? "bg-pink-100 text-pink-600"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <HelpCircle className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <span className="mb-1 inline-block text-xs font-semibold uppercase tracking-wide text-pink-500">
                            {faq.category}
                          </span>

                          <h3
                            className={`text-sm font-semibold leading-6 sm:text-base ${
                              isOpen
                                ? "text-pink-700"
                                : "text-gray-900"
                            }`}
                          >
                            {faq.question}
                          </h3>
                        </div>
                      </div>

                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-pink-600" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="border-t border-pink-100 px-5 pb-5 pt-4 sm:px-6">
                        <div className="ml-0 flex gap-4 sm:ml-13">
                          <p className="text-sm leading-7 text-gray-600">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* =========================================
                NO RESULTS
            ========================================= */
            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm">
                <Search className="h-6 w-6" />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                No questions found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                We couldn't find an FAQ matching your search.
                Try another keyword or clear your filters.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-xl bg-pink-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-700"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* =========================================
            SUPPORT CTA
        ========================================= */}
        <section className="relative mt-16 overflow-hidden rounded-3xl bg-linear-to-br from-pink-600 to-pink-700 px-6 py-12 text-white sm:px-10">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
          <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/10" />

          <div className="relative mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <Headphones className="h-7 w-7" />
            </div>

            <h2 className="mt-5 text-2xl font-bold sm:text-3xl">
              Still need help?
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-pink-100 sm:text-base">
              Our support team is here to help with your orders,
              payments, delivery, returns, and account questions.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="mailto:support@shopease.com"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-pink-600 transition hover:bg-pink-50"
              >
                <Mail className="h-4 w-4" />
                Email Support
              </a>

              <a
                href="mailto:help@shopease.com"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                <MessageCircle className="h-4 w-4" />
                Get Help
              </a>
            </div>
          </div>
        </section>

        {/* =========================================
            TRUST INFORMATION
        ========================================= */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5 text-center">
            <ShieldCheck className="mx-auto h-6 w-6 text-pink-600" />

            <h3 className="mt-3 text-sm font-semibold text-gray-900">
              Secure Shopping
            </h3>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Your account and shopping experience are protected.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5 text-center">
            <Truck className="mx-auto h-6 w-6 text-pink-600" />

            <h3 className="mt-3 text-sm font-semibold text-gray-900">
              Easy Delivery
            </h3>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Manage your orders and delivery addresses easily.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5 text-center">
            <Heart className="mx-auto h-6 w-6 text-pink-600" />

            <h3 className="mt-3 text-sm font-semibold text-gray-900">
              Customer Support
            </h3>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              We're here when you need assistance.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}