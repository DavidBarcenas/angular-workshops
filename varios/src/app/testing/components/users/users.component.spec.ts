import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersComponent } from './users.component';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';
import { userMock } from '../../_fixtures_/user.mock';
import { Component, Directive, Input } from '@angular/core';
import { User } from '../../models/user.model';
import { By } from '@angular/platform-browser';
import { UserComponent } from '../user/user.component';

@Directive({
  selector: 'routerLink[]',
  host: { '(click)': 'onClick()' },
})
class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;

  @Component({
    selector: 'app-user',
    standalone: true,
    imports: [],
    template: '<div></div>',
    styles: [],
  })
  class FakeUserComponent {
    @Input() user: User | undefined;
  }

  beforeEach(() => {
    mockUserService = jasmine.createSpyObj('UserService', ['getUsers', 'addUser', 'deleteUSer']);

    TestBed.configureTestingModule({
      imports: [
        UsersComponent,
        UserComponent,
        RouterLinkDirectiveStub,
        // FakeUserComponent
      ],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    });
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set users correctly from the service', () => {
    mockUserService.getUsers.and.returnValue(of([userMock]));
    fixture.detectChanges();
    expect(fixture.componentInstance.users.length).toBe(1);
  });

  it('should create one li for each hero', () => {
    mockUserService.getUsers.and.returnValue(of([userMock]));
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('li')).length).toBe(1);
  });

  it('should render each user as a UserComponent', () => {
    mockUserService.getUsers.and.returnValue(of([userMock]));
    fixture.detectChanges();
    const userComponentsDEs = fixture.debugElement.queryAll(By.directive(UserComponent));
    expect(userComponentsDEs.length).toBe(1);
    userComponentsDEs.forEach((userComponentDE, i) => {
      expect(userComponentDE.componentInstance.user).toBe(userMock);
    });
  });

  it('should call userService.deleteUser when delete button is clicked', () => {
    spyOn(fixture.componentInstance, 'delete');
    mockUserService.getUsers.and.returnValue(of([userMock]));
    fixture.detectChanges();

    const userComponents = fixture.debugElement.queryAll(By.directive(UserComponent));
    /* option 1
    userComponents[0].query(By.css('button')).triggerEventHandler('click', {
      stopPropagation: () => {},
    }); */
    /* option 2
    userComponents[0].componentInstance.delete.emit(undefined); */
    // option 3
    userComponents[0].triggerEventHandler('delete', null);
    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(userMock);
  });

  it('should add a new user to the user list when add button is clicked', () => {
    mockUserService.getUsers.and.returnValue(of([userMock]));
    fixture.detectChanges();

    const newUser: User = { ...userMock, id: 10, name: 'new-name' };
    mockUserService.addUser.and.returnValue(of(newUser));
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    const addButton = fixture.debugElement.queryAll(By.css('button'))[0];

    inputElement.value = newUser.name;
    addButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    const heroText = fixture.debugElement.query(By.css('li')).nativeElement.textContent;
    expect(heroText).toContain(newUser.name);
  });

  it('should have the correct route for first hero', () => {
    mockUserService.getUsers.and.returnValue(of([userMock]));
    fixture.detectChanges();

    const userComponents = fixture.debugElement.queryAll(By.directive(UserComponent));
    const routerLink = userComponents[0]
      .query(By.directive(RouterLinkDirectiveStub))
      .injector.get(RouterLinkDirectiveStub);

    userComponents[0].query(By.css('a')).triggerEventHandler('click', null);
    expect(routerLink.navigatedTo).toBe('/users/1');
  });
});
