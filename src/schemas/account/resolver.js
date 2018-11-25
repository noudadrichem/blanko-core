const resolvers = {
  Query: {
    accounts(_, args, { domain: { Account } }) {
      return Account.all()
    }
  }
};

export default resolvers;
