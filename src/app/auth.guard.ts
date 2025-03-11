import { CanActivateFn } from '@angular/router';
import { LoginService } from "./services/login.service";
import { inject } from "@angular/core";
import { Router } from "@angular/router";

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(LoginService)
  const router = inject(Router)

  if(!auth.isAuthenticated()) {
    router.navigateByUrl('/')
    return false
  }
  return true
};
