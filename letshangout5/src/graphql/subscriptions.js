/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTodo = /* GraphQL */ `
  subscription OnCreateTodo($owner: String!) {
    onCreateTodo(owner: $owner) {
      id
      name
      description
      owner
    }
  }
`;
export const onUpdateTodo = /* GraphQL */ `
  subscription OnUpdateTodo($owner: String!) {
    onUpdateTodo(owner: $owner) {
      id
      name
      description
      owner
    }
  }
`;
export const onDeleteTodo = /* GraphQL */ `
  subscription OnDeleteTodo($owner: String!) {
    onDeleteTodo(owner: $owner) {
      id
      name
      description
      owner
    }
  }
`;
export const onCreatePost = /* GraphQL */ `
  subscription OnCreatePost($owner: String!) {
    onCreatePost(owner: $owner) {
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
export const onUpdatePost = /* GraphQL */ `
  subscription OnUpdatePost($owner: String!) {
    onUpdatePost(owner: $owner) {
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
export const onDeletePost = /* GraphQL */ `
  subscription OnDeletePost($owner: String!) {
    onDeletePost(owner: $owner) {
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
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment($owner: String!) {
    onCreateComment(owner: $owner) {
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
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment($owner: String!) {
    onUpdateComment(owner: $owner) {
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
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment($owner: String!) {
    onDeleteComment(owner: $owner) {
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
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($owner: String!) {
    onCreateUser(owner: $owner) {
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
          busy
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($owner: String!) {
    onUpdateUser(owner: $owner) {
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
          busy
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($owner: String!) {
    onDeleteUser(owner: $owner) {
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
          busy
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
export const onCreateUserPrivateData = /* GraphQL */ `
  subscription OnCreateUserPrivateData($owner: String!) {
    onCreateUserPrivateData(owner: $owner) {
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
export const onUpdateUserPrivateData = /* GraphQL */ `
  subscription OnUpdateUserPrivateData($owner: String!) {
    onUpdateUserPrivateData(owner: $owner) {
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
export const onDeleteUserPrivateData = /* GraphQL */ `
  subscription OnDeleteUserPrivateData($owner: String!) {
    onDeleteUserPrivateData(owner: $owner) {
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
export const onCreateCalendarEntry = /* GraphQL */ `
  subscription OnCreateCalendarEntry($owner: String!) {
    onCreateCalendarEntry(owner: $owner) {
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
          busy
        }
        owner
      }
      owner
      busy
    }
  }
`;
export const onUpdateCalendarEntry = /* GraphQL */ `
  subscription OnUpdateCalendarEntry($owner: String!) {
    onUpdateCalendarEntry(owner: $owner) {
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
          busy
        }
        owner
      }
      owner
      busy
    }
  }
`;
export const onDeleteCalendarEntry = /* GraphQL */ `
  subscription OnDeleteCalendarEntry($owner: String!) {
    onDeleteCalendarEntry(owner: $owner) {
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
          busy
        }
        owner
      }
      owner
      busy
    }
  }
`;
export const onCreateCalendarEntryPrivateData = /* GraphQL */ `
  subscription OnCreateCalendarEntryPrivateData($owner: String!) {
    onCreateCalendarEntryPrivateData(owner: $owner) {
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
        busy
      }
      owner
    }
  }
`;
export const onUpdateCalendarEntryPrivateData = /* GraphQL */ `
  subscription OnUpdateCalendarEntryPrivateData($owner: String!) {
    onUpdateCalendarEntryPrivateData(owner: $owner) {
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
        busy
      }
      owner
    }
  }
`;
export const onDeleteCalendarEntryPrivateData = /* GraphQL */ `
  subscription OnDeleteCalendarEntryPrivateData($owner: String!) {
    onDeleteCalendarEntryPrivateData(owner: $owner) {
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
        busy
      }
      owner
    }
  }
`;
