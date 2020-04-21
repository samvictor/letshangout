/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTodo = /* GraphQL */ `
  query GetTodo($id: ID!) {
    getTodo(id: $id) {
      id
      name
      description
      owner
    }
  }
`;
export const listTodos = /* GraphQL */ `
  query ListTodos(
    $filter: ModelTodoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        owner
      }
      nextToken
    }
  }
`;
export const getPost = /* GraphQL */ `
  query GetPost($id: ID!) {
    getPost(id: $id) {
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
export const listPosts = /* GraphQL */ `
  query ListPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getComment = /* GraphQL */ `
  query GetComment($id: ID!) {
    getComment(id: $id) {
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
export const listComments = /* GraphQL */ `
  query ListComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        content
        post {
          id
          title
          content
          hidden
          posted
          owner
        }
        author {
          id
          name
          description
          owner
        }
        owner
      }
      nextToken
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getUserPrivateData = /* GraphQL */ `
  query GetUserPrivateData($id: ID!) {
    getUserPrivateData(id: $id) {
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
export const listUserPrivateDatas = /* GraphQL */ `
  query ListUserPrivateDatas(
    $filter: ModelUserPrivateDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserPrivateDatas(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const getCalendarEntry = /* GraphQL */ `
  query GetCalendarEntry($id: ID!) {
    getCalendarEntry(id: $id) {
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
export const listCalendarEntrys = /* GraphQL */ `
  query ListCalendarEntrys(
    $filter: ModelCalendarEntryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCalendarEntrys(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getCalendarEntryPrivateData = /* GraphQL */ `
  query GetCalendarEntryPrivateData($id: ID!) {
    getCalendarEntryPrivateData(id: $id) {
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
export const listCalendarEntryPrivateDatas = /* GraphQL */ `
  query ListCalendarEntryPrivateDatas(
    $filter: ModelCalendarEntryPrivateDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCalendarEntryPrivateDatas(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
