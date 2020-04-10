import User from '../model/User';
import backend from '../services/backend';

class Auth {
  private user: User | undefined = undefined;

  async login(id: string, password: string, role: string): Promise<any> {
    this.user = await backend.login(id, password, role);
  }

  logout(): void {
    this.user = undefined;
    backend.logout();
  }

  getUser(): User {
    return this.user;
  }

  isLoggedIn(): boolean {
    return this.user !== undefined;
  }

  async tryRefresh(force?: boolean): Promise<void> {
    if (this.user && !force) {
      return;
    }
    try {
      this.user = await backend.getUser();
    } catch (e) {
    }
  }
}

export default new Auth();
