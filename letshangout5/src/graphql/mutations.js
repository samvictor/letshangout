/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTodo = /* GraphQL */ `
  mutation CreateTodo(
    $input: CreateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    createTodo(input: $input, condition: $condition) {
      id
      name
      description
      owner
    }
  }
`;
export const updateTodo = /* GraphQL */ `
  mutation UpdateTodo(
    $input: UpdateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    updateTodo(input: $input, condition: $condition) {
      id
      name
      description
      owner
    }
  }
`;
export const deleteTodo = /* GraphQL */ `
  mutation DeleteTodo(
    $input: DeleteTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    deleteTodo(input: $input, condition: $condition) {
      id
      name
      description
      owner
    }
  }
`;
export const createPost = /* GraphQL */ `
  mutation CreatePost(
    $input: CreatePostInput!
    $condition: ModelPostConditionInput
  ) {
    createPost(input: $input, condition: $condition) {
      id
      title
      content
      hidden
      comments {
        items {
          id
          content
          owner
        }
        nextToken
      }
      author {
        id
        name
        description
        posts {
          nextToken
        }
        comments {
          nextToken
        }
        calendarEntries {
          nextToken
        }
        privateData {
          id
          email
          owner
        }
        owner
      }
      posted
      owner
    }
  }
`;
export const updatePost = /* GraphQL */ `
  mutation UpdatePost(
    $input: UpdatePostInput!
    $condition: ModelPostConditionInput
  ) {
    updatePost(input: $input, condition: $condition) {
      id
      title
      content
      hidden
      comments {
        items {
          id
          content
          owner
        }
        nextToken
      }
      author {
        id
        name
        description
        posts {
          nextToken
        }
        comments {
          nextToken
        }
        calendarEntries {
          nextToken
        }
        privateData {
          id
          email
          owner
        }
        owner
      }
      posted
      owner
    }
  }
`;
export const deletePost = /* GraphQL */ `
  mutation DeletePost(
    $input: DeletePostInput!
    $condition: ModelPostConditionInput
  ) {
    deletePost(input: $input, condition: $condition) {
      id
      title
      content
      hidden
      comments {
        items {
          id
          content
          owner
        }
        nextToken
      }
      author {
        id
        name
        description
        posts {
          nextToken
        }
        comments {
          nextToken
        }
        calendarEntries {
          nextToken
        }
        privateData {
          id
          email
          owner
        }
        owner
      }
      posted
      owner
    }
  }
`;
export const createComment = /* GraphQL */ `
  mutation CreateComment(
    $input: CreateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    createComment(input: $input, condition: $condition) {
      id
      content
      post {
        id
        title
        content
        hidden
        comments {
          nextToken
        }
        author {
          id
          name
          description
          owner
        }
        posted
        owner
      }
      author {
        id
        name
        description
        posts {
          nextToken
        }
        comments {
          nextToken
        }
        calendarEntries {
          nextToken
        }
        privateData {
          id
          email
          owner
        }
        owner
      }
      owner
    }
  }
`;
export const updateComment = /* GraphQL */ `
  mutation UpdateComment(
    $input: UpdateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    updateComment(input: $input, condition: $condition) {
      id
      content
      post {
        id
        title
        content
        hidden
        comments {
          nextToken
        }
        author {
          id
          name
          description
          owner
        }
        posted
        owner
      }
      author {
        id
        name
        description
        posts {
          nextToken
        }
        comments {
          nextToken
        }
        calendarEntries {
          nextToken
        }
        privateData {
          id
          email
          owner
        }
        owner
      }
      owner
    }
  }
`;
export const deleteComment = /* GraphQL */ `
  mutation DeleteComment(
    $input: DeleteCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    deleteComment(input: $input, condition: $condition) {
      id
      content
      post {
        id
        title
        content
        hidden
        comments {
          nextToken
        }
        author {
          id
          name
          description
          owner
        }
        posted
        owner
      }
      author {
        id
        name
        description
        posts {
          nextToken
        }
        comments {
          nextToken
        }
        calendarEntries {
          nextToken
        }
        privateData {
          id
          email
          owner
        }
        owner
      }
      owner
    }
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      name
      description
      posts {
        items {
          id
          title
          content
          hidden
          posted
          owner
        }
        nextToken
      }
      comments {
        items {
          id
          content
          owner
        }
        nextToken
      }
      calendarEntries {
        items {
          id
          startDate
          endDate
          repeating
          repeatingDays
          repeatingDates
          owner
        }
        nextToken
      }
      privateData {
        id
        email
        user {
          id
          name
          description
          owner
        }
        owner
      }
      owner
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      name
      description
      posts {
        items {
          id
          title
          content
          hidden
          posted
          owner
        }
        nextToken
      }
      comments {
        items {
          id
          content
          owner
        }
        nextToken
      }
      calendarEntries {
        items {
          id
          startDate
          endDate
          repeating
          repeatingDays
          repeatingDates
          owner
        }
        nextToken
      }
      privateData {
        id
        email
        user {
          id
          name
          description
          owner
        }
        owner
      }
      owner
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      name
      description
      posts {
        items {
          id
          title
          content
          hidden
          posted
          owner
        }
        nextToken
      }
      comments {
        items {
          id
          content
          owner
        }
        nextToken
      }
      calendarEntries {
        items {
          id
          startDate
          endDate
          repeating
          repeatingDays
          repeatingDates
          owner
        }
        nextToken
      }
      privateData {
        id
        email
        user {
          id
          name
          description
          owner
        }
        owner
      }
      owner
    }
  }
`;
export const createUserPrivateData = /* GraphQL */ `
  mutation CreateUserPrivateData(
    $input: CreateUserPrivateDataInput!
    $condition: ModelUserPrivateDataConditionInput
  ) {
    createUserPrivateData(input: $input, condition: $condition) {
      id
      email
      user {
        id
        name
        description
        posts {
          nextToken
        }
        comments {
          nextToken
        }
        calendarEntries {
          nextToken
        }
        privateData {
          id
          email
          owner
        }
        owner
      }
      owner
    }
  }
`;
export const updateUserPrivateData = /* GraphQL */ `
  mutation UpdateUserPrivateData(
    $input: UpdateUserPrivateDataInput!
    $condition: ModelUserPrivateDataConditionInput
  ) {
    updateUserPrivateData(input: $input, condition: $condition) {
      id
      email
      user {
        id
        name
        description
        posts {
          nextToken
        }
        comments {
          nextToken
        }
        calendarEntries {
          nextToken
        }
        privateData {
          id
          email
          owner
        }
        owner
      }
      owner
    }
  }
`;
export const deleteUserPrivateData = /* GraphQL */ `
  mutation DeleteUserPrivateData(
    $input: DeleteUserPrivateDataInput!
    $condition: ModelUserPrivateDataConditionInput
  ) {
    deleteUserPrivateData(input: $input, condition: $condition) {
      id
      email
      user {
        id
        name
        description
        posts {
          nextToken
        }
        comments {
          nextToken
        }
        calendarEntries {
          nextToken
        }
        privateData {
          id
          email
          owner
        }
        owner
      }
      owner
    }
  }
`;
export const createCalendarEntry = /* GraphQL */ `
  mutation CreateCalendarEntry(
    $input: CreateCalendarEntryInput!
    $condition: ModelCalendarEntryConditionInput
  ) {
    createCalendarEntry(input: $input, condition: $condition) {
      id
      startDate
      endDate
      repeating
      repeatingDays
      repeatingDates
      ownerDetails {
        id
        name
        description
        posts {
          nextToken
        }
        comments {
          nextToken
        }
        calendarEntries {
          nextToken
        }
        privateData {
          id
          email
          owner
        }
        owner
      }
      privateData {
        id
        name
        description
        calendarEntry {
          id
          startDate
          endDate
          repeating
          repeatingDays
          repeatingDates
          owner
        }
        owner
      }
      owner
    }
  }
`;
export const updateCalendarEntry = /* GraphQL */ `
  mutation UpdateCalendarEntry(
    $input: UpdateCalendarEntryInput!
    $condition: ModelCalendarEntryConditionInput
  ) {
    updateCalendarEntry(input: $input, condition: $condition) {
      id
      startDate
      endDate
      repeating
      repeatingDays
      repeatingDates
      ownerDetails {
        id
        name
        description
        posts {
          nextToken
        }
        comments {
          nextToken
        }
        calendarEntries {
          nextToken
        }
        privateData {
          id
          email
          owner
        }
        owner
      }
      privateData {
        id
        name
        description
        calendarEntry {
          id
          startDate
          endDate
          repeating
          repeatingDays
          repeatingDates
          owner
        }
        owner
      }
      owner
    }
  }
`;
export const deleteCalendarEntry = /* GraphQL */ `
  mutation DeleteCalendarEntry(
    $input: DeleteCalendarEntryInput!
    $condition: ModelCalendarEntryConditionInput
  ) {
    deleteCalendarEntry(input: $input, condition: $condition) {
      id
      startDate
      endDate
      repeating
      repeatingDays
      repeatingDates
      ownerDetails {
        id
        name
        description
        posts {
          nextToken
        }
        comments {
          nextToken
        }
        calendarEntries {
          nextToken
        }
        privateData {
          id
          email
          owner
        }
        owner
      }
      privateData {
        id
        name
        description
        calendarEntry {
          id
          startDate
          endDate
          repeating
          repeatingDays
          repeatingDates
          owner
        }
        owner
      }
      owner
    }
  }
`;
export const createCalendarEntryPrivateData = /* GraphQL */ `
  mutation CreateCalendarEntryPrivateData(
    $input: CreateCalendarEntryPrivateDataInput!
    $condition: ModelCalendarEntryPrivateDataConditionInput
  ) {
    createCalendarEntryPrivateData(input: $input, condition: $condition) {
      id
      name
      description
      calendarEntry {
        id
        startDate
        endDate
        repeating
        repeatingDays
        repeatingDates
        ownerDetails {
          id
          name
          description
          owner
        }
        privateData {
          id
          name
          description
          owner
        }
        owner
      }
      owner
    }
  }
`;
export const updateCalendarEntryPrivateData = /* GraphQL */ `
  mutation UpdateCalendarEntryPrivateData(
    $input: UpdateCalendarEntryPrivateDataInput!
    $condition: ModelCalendarEntryPrivateDataConditionInput
  ) {
    updateCalendarEntryPrivateData(input: $input, condition: $condition) {
      id
      name
      description
      calendarEntry {
        id
        startDate
        endDate
        repeating
        repeatingDays
        repeatingDates
        ownerDetails {
          id
          name
          description
          owner
        }
        privateData {
          id
          name
          description
          owner
        }
        owner
      }
      owner
    }
  }
`;
export const deleteCalendarEntryPrivateData = /* GraphQL */ `
  mutation DeleteCalendarEntryPrivateData(
    $input: DeleteCalendarEntryPrivateDataInput!
    $condition: ModelCalendarEntryPrivateDataConditionInput
  ) {
    deleteCalendarEntryPrivateData(input: $input, condition: $condition) {
      id
      name
      description
      calendarEntry {
        id
        startDate
        endDate
        repeating
        repeatingDays
        repeatingDates
        ownerDetails {
          id
          name
          description
          owner
        }
        privateData {
          id
          name
          description
          owner
        }
        owner
      }
      owner
    }
  }
`;
