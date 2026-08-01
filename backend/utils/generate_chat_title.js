
// Used to create a new chat title using the user's first question
export function createNewChatTitle(firstUserQuestion) {
    const chatTitle = firstUserQuestion.trim()
    const maxLength = 40

    // Trim the title if more than 40 characters long
    if(chatTitle.length > maxLength) {
        return chatTitle.slice(0, maxLength) + "..."
    }

    return chatTitle 
}
