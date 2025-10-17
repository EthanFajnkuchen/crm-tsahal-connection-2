import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
}

const countryCodes = [
  { code: "+33", country: "France" },
  { code: "+972", country: "Israël" },
  { code: "+1", country: "États-Unis/Canada" },
  { code: "+44", country: "Royaume-Uni" },
  { code: "+49", country: "Allemagne" },
  { code: "+39", country: "Italie" },
  { code: "+34", country: "Espagne" },
  { code: "+32", country: "Belgique" },
  { code: "+41", country: "Suisse" },
  { code: "+31", country: "Pays-Bas" },
];

export function PhoneInput({
  value,
  onChange,
  label = "Téléphone",
  placeholder = "Numéro de téléphone",
  disabled = false,
  error,
  required = false,
}: PhoneInputProps) {
  const [countryCode, setCountryCode] = React.useState("+33");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Parse the initial value only once
  React.useEffect(() => {
    if (!isInitialized) {
      if (value) {
        const match = value.match(/^(\+\d{1,4})(.*)$/);
        if (match) {
          const detectedCode = match[1];
          const detectedNumber = match[2];

          // Check if the detected code is in our list
          const isKnownCode = countryCodes.some(
            (country) => country.code === detectedCode
          );

          if (isKnownCode) {
            setCountryCode(detectedCode);
            setPhoneNumber(detectedNumber);
          } else {
            // If unknown code, try to find the best match (longest matching prefix)
            const bestMatch = countryCodes
              .filter((country) => detectedCode.startsWith(country.code))
              .sort((a, b) => b.code.length - a.code.length)[0];

            if (bestMatch) {
              setCountryCode(bestMatch.code);
              setPhoneNumber(
                detectedCode.substring(bestMatch.code.length) + detectedNumber
              );
            } else {
              // Fallback: use the detected code as-is
              setCountryCode(detectedCode);
              setPhoneNumber(detectedNumber);
            }
          }
        } else {
          setPhoneNumber(value);
        }
      }
      setIsInitialized(true);
    }
  }, [value, isInitialized]);

  // Update parent only when user changes values (not during initialization)
  React.useEffect(() => {
    if (isInitialized) {
      const fullNumber = countryCode + phoneNumber;
      // Only send to parent if there's actually a phone number (not just country code)
      if (fullNumber !== value && phoneNumber.length > 0) {
        onChange(fullNumber);
      } else if (phoneNumber.length === 0 && value !== "") {
        // If phone number is empty, send empty string to parent
        onChange("");
      }
    }
  }, [countryCode, phoneNumber, onChange, value, isInitialized]);

  const handleCountryCodeChange = (newCode: string) => {
    setCountryCode(newCode);
  };

  const handlePhoneNumberChange = (newNumber: string) => {
    // Remove any non-digit characters except +
    const cleaned = newNumber.replace(/[^\d]/g, "");
    setPhoneNumber(cleaned);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="phone-input" className="flex items-center gap-2">
        <span>{label}</span>
        {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="flex gap-2">
        <select
          value={countryCode}
          onChange={(e) => handleCountryCodeChange(e.target.value)}
          disabled={disabled}
          className="flex h-10 w-32 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {countryCodes.map((country) => (
            <option key={country.code} value={country.code}>
              {country.code}
            </option>
          ))}
        </select>
        <Input
          id="phone-input"
          type="tel"
          value={phoneNumber}
          onChange={(e) => handlePhoneNumberChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={error ? "border-red-500" : ""}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
