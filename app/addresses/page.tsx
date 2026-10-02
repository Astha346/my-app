
"use client";

import { useEffect, useState } from "react";

type Address = {
  _id: string;
  label: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  isDefault: boolean;
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [label, setLabel] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  // Track whether user has interacted with each field
  const [touched, setTouched] = useState({
    label: false,
    address: false,
    phone: false,
    latitude: false,
    longitude: false,
  });

  const loadAddresses = async () => {
    try {
      const userData = localStorage.getItem("user");

      if (!userData) {
        setLoading(false);
        return;
      }

      const user = JSON.parse(userData);
      const userId = user._id || user.id;

      if (!userId) {
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:3001/addresses/${userId}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch addresses");
      }

      const data = await response.json();

      setAddresses(data);
    } catch (error) {
      console.error("Error loading addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  // -----------------------------
  // Validation
  // -----------------------------

  const labelError =
    label.trim().length > 0 &&
    label.trim().length < 2
      ? "Label must be at least 2 characters."
      : "";

  const addressError =
    address.trim().length > 0 &&
    address.trim().length < 5
      ? "Address must be at least 5 characters."
      : "";

  const phoneError =
    phone.length > 0 &&
    !/^(97|98)\d{8}$/.test(phone)
      ? "Phone number must be a valid Nepal mobile number."
      : "";

  const latitudeNumber = Number(latitude);

  const latitudeError =
    latitude !== "" &&
    (Number.isNaN(latitudeNumber) ||
      latitudeNumber < -90 ||
      latitudeNumber > 90)
      ? "Latitude must be between -90 and 90."
      : "";

  const longitudeNumber = Number(longitude);

  const longitudeError =
    longitude !== "" &&
    (Number.isNaN(longitudeNumber) ||
      longitudeNumber < -180 ||
      longitudeNumber > 180)
      ? "Longitude must be between -180 and 180."
      : "";

  const handleAddAddress = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    // Show validation messages for all fields
    setTouched({
      label: true,
      address: true,
      phone: true,
      latitude: true,
      longitude: true,
    });

    // Required field validation
    if (!label.trim()) {
      return;
    }

    if (!address.trim()) {
      return;
    }

    if (!latitude) {
      return;
    }

    if (!longitude) {
      return;
    }

    // Format validation
    if (labelError || addressError || phoneError) {
      return;
    }

    if (latitudeError || longitudeError) {
      return;
    }

    try {
      const userData = localStorage.getItem("user");

      if (!userData) {
        alert("Please login first.");
        return;
      }

      const user = JSON.parse(userData);
      const userId = user._id || user.id;

      const response = await fetch(
        "http://localhost:3001/addresses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            label: label.trim(),
            address: address.trim(),
            latitude: latitudeNumber,
            longitude: longitudeNumber,
            phone,
            isDefault,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to add address");
      }

      await loadAddresses();

      setLabel("");
      setAddress("");
      setPhone("");
      setLatitude("");
      setLongitude("");
      setIsDefault(false);

      setTouched({
        label: false,
        address: false,
        phone: false,
        latitude: false,
        longitude: false,
      });

      setShowForm(false);

      alert("Address added successfully.");
    } catch (error) {
      console.error("Error adding address:", error);
      alert("Failed to add address.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        Loading addresses...
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            My Addresses
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your saved delivery addresses.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-pink-600 px-5 py-3 font-medium text-white hover:bg-pink-700"
        >
          {showForm ? "Cancel" : "+ Add Address"}
        </button>
      </div>

      {/* ADD ADDRESS FORM */}
      {showForm && (
        <form
          onSubmit={handleAddAddress}
          className="mt-8 rounded-xl border bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold">
            Add New Address
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">

            {/* LABEL */}
            <div>
              <label className="text-sm font-medium">
                Label
              </label>

              <input
                type="text"
                placeholder="Home"
                value={label}
                onChange={(e) =>
                  setLabel(e.target.value)
                }
                onBlur={() =>
                  setTouched((prev) => ({
                    ...prev,
                    label: true,
                  }))
                }
                className={`mt-1 w-full rounded-lg border px-4 py-3 outline-none focus:border-pink-500 ${
                  touched.label && labelError
                    ? "border-red-500"
                    : ""
                }`}
              />

              {touched.label && !label.trim() && (
                <p className="mt-1 text-sm text-red-500">
                  ⚠ Label is required.
                </p>
              )}

              {touched.label && labelError && (
                <p className="mt-1 text-sm text-red-500">
                  ⚠ {labelError}
                </p>
              )}
            </div>

            {/* PHONE */}
            <div>
              <label className="text-sm font-medium">
                Phone
              </label>

              <input
                type="text"
                placeholder="98XXXXXXXX"
                value={phone}
                maxLength={10}
                onChange={(e) => {
                  const value = e.target.value;

                  if (/^\d*$/.test(value)) {
                    setPhone(value);
                  }
                }}
                onBlur={() =>
                  setTouched((prev) => ({
                    ...prev,
                    phone: true,
                  }))
                }
                className={`mt-1 w-full rounded-lg border px-4 py-3 outline-none focus:border-pink-500 ${
                  touched.phone && phoneError
                    ? "border-red-500"
                    : ""
                }`}
              />

              {touched.phone && phoneError && (
                <p className="mt-1 text-sm text-red-500">
                  ⚠ {phoneError}
                </p>
              )}

              {touched.phone &&
                phone &&
                !phoneError && (
                  <p className="mt-1 text-sm text-green-600">
                    ✓ Valid phone number
                  </p>
                )}
            </div>

            {/* ADDRESS */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium">
                Address
              </label>

              <input
                type="text"
                placeholder="New Baneshwor, Kathmandu"
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
                onBlur={() =>
                  setTouched((prev) => ({
                    ...prev,
                    address: true,
                  }))
                }
                className={`mt-1 w-full rounded-lg border px-4 py-3 outline-none focus:border-pink-500 ${
                  touched.address && addressError
                    ? "border-red-500"
                    : ""
                }`}
              />

              {touched.address &&
                !address.trim() && (
                  <p className="mt-1 text-sm text-red-500">
                    ⚠ Address is required.
                  </p>
                )}

              {touched.address && addressError && (
                <p className="mt-1 text-sm text-red-500">
                  ⚠ {addressError}
                </p>
              )}
            </div>

            {/* LATITUDE */}
            <div>
              <label className="text-sm font-medium">
                Latitude
              </label>

              <input
                type="number"
                step="any"
                placeholder="27.6916"
                value={latitude}
                onChange={(e) =>
                  setLatitude(e.target.value)
                }
                onBlur={() =>
                  setTouched((prev) => ({
                    ...prev,
                    latitude: true,
                  }))
                }
                className={`mt-1 w-full rounded-lg border px-4 py-3 outline-none focus:border-pink-500 ${
                  touched.latitude && latitudeError
                    ? "border-red-500"
                    : ""
                }`}
              />

              {touched.latitude && !latitude && (
                <p className="mt-1 text-sm text-red-500">
                  ⚠ Latitude is required.
                </p>
              )}

              {touched.latitude && latitudeError && (
                <p className="mt-1 text-sm text-red-500">
                  ⚠ {latitudeError}
                </p>
              )}
            </div>

            {/* LONGITUDE */}
            <div>
              <label className="text-sm font-medium">
                Longitude
              </label>

              <input
                type="number"
                step="any"
                placeholder="85.3420"
                value={longitude}
                onChange={(e) =>
                  setLongitude(e.target.value)
                }
                onBlur={() =>
                  setTouched((prev) => ({
                    ...prev,
                    longitude: true,
                  }))
                }
                className={`mt-1 w-full rounded-lg border px-4 py-3 outline-none focus:border-pink-500 ${
                  touched.longitude && longitudeError
                    ? "border-red-500"
                    : ""
                }`}
              />

              {touched.longitude && !longitude && (
                <p className="mt-1 text-sm text-red-500">
                  ⚠ Longitude is required.
                </p>
              )}

              {touched.longitude && longitudeError && (
                <p className="mt-1 text-sm text-red-500">
                  ⚠ {longitudeError}
                </p>
              )}
            </div>
          </div>

          {/* DEFAULT ADDRESS */}
          <label className="mt-5 flex items-center gap-2">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) =>
                setIsDefault(e.target.checked)
              }
            />

            <span className="text-sm">
              Set as default address
            </span>
          </label>

          {/* SAVE */}
          <button
            type="submit"
            className="mt-6 rounded-lg bg-pink-600 px-6 py-3 font-medium text-white hover:bg-pink-700"
          >
            Save Address
          </button>
        </form>
      )}

      {/* SAVED ADDRESSES */}
      {addresses.length === 0 ? (
        <div className="mt-8 rounded-xl border p-8 text-center">
          <p className="text-gray-500">
            You don't have any saved addresses yet.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {addresses.map((item) => (
            <div
              key={item._id}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">
                  {item.label}
                </h2>

                {item.isDefault && (
                  <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-600">
                    Default
                  </span>
                )}
              </div>

              <p className="mt-3 text-gray-600">
                {item.address}
              </p>

              {item.phone && (
                <p className="mt-2 text-sm text-gray-500">
                  Phone: {item.phone}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
