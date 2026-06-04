import { CanActivateFn } from '@angular/router';
import { inject, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../store/app.selector';
import { User, UserRole } from '../model/user.model';
import { MessageService } from '../service/message.service';
import { MessageSeverity } from '../model/message-severity.model';

export const roleGuard = (allowedRoles: UserRole | UserRole[]): CanActivateFn => {
	return () => {
		const store: Store = inject(Store);
		const currentUser: Signal<User | null> = store.selectSignal(selectCurrentUser);

		const allowedRolesArray: UserRole[] = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

		const isAllowed: boolean = currentUser().roles.some((role: UserRole) => allowedRolesArray.includes(role));

		if (!isAllowed) {
			const messageService: MessageService = inject(MessageService);
			messageService.showMessage(
				MessageSeverity.WARN,
				'messages.auth.insufficient-privileges.title',
				'messages.auth.insufficient-privileges.message',
			);
		}

		return isAllowed;
	};
};