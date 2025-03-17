/**
 * Throws an error if the provided value is `null`.
 *
 * @param value - The value to validate.
 * @param errorMessage - The error message to throw if the value is `null`.
 * @returns The validated value if it is not `null`.
 * @throws Error - will throw an error with the provided message if the value is `null`.
 */
export function throwIfNull<TElementType>(value: TElementType | null, errorMessage: string): TElementType {
  if (value === null) {
    throw new Error(errorMessage)
  }
  return value
}
