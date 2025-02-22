const date = new Date();
date.setHours(0, 0, 0, 0);

function getTimestamp(date, offsetMinutes = 0) {
  return date.getTime() + offsetMinutes * 60000;
}

export const currentUser = {
  id: 'c94c0e76-fb49-4b9b-8f07-9f93ed93b4f3',
  name: 'John Doe',
};

export const supportAgent = {
  id: 'd16d1a4c-5c67-4e20-b7v0e-2991c22747c3',
  name: 'Support Agent',
  avatarUrl: '../../../../images/petersmith.png',
};

export const messages = [
  {
    timestamp: getTimestamp(date, -9),
    author: supportAgent,
    text: 'Hello, John!\nHow can I assist you today?',
  },
  {
    timestamp: getTimestamp(date, -7),
    author: currentUser,
    text: 'Hi, I\'m having trouble accessing my account.',
  },
  {
    timestamp: getTimestamp(date, -7),
    author: currentUser,
    text: 'It says my password is incorrect.',
  },
  {
    timestamp: getTimestamp(date, -7),
    author: supportAgent,
    text: 'I can help you with that. Can you please confirm your UserID for security purposes?',
  },
  {
    timestamp: getTimestamp(date, 1),
    author: currentUser,
    text: 'john.doe1357',
  },
  {
    timestamp: getTimestamp(date, 1),
    author: supportAgent,
    text: '✅ Instructions to restore access have been sent to the email address associated with your account.',
  },
];
