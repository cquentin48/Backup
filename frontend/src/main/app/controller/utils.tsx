/**
 * Notification error for message
 */
export interface NotificationError {
    /**
     * Error message
     */
    message: string

    /**
     * Error type
     */
    variant: "error" | "default" | "success" | "warning" | "info" | undefined
}
