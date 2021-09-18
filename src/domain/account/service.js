class AccountService {
    constructor(AccountRepository) {
        this.repository = AccountRepository;
    };

    async addAccount(info) {
        return this.repository.add(info);
    }

    async findAll() {
        return this.repository.all();
    }

    async findProfile(userId) {
        return this.repository.profile(userId);
    }
}

export default AccountService;