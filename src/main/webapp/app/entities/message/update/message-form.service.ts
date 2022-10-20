import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IMessage, NewMessage } from '../message.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMessage for edit and NewMessageFormGroupInput for create.
 */
type MessageFormGroupInput = IMessage | PartialWithRequiredKeyOf<NewMessage>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IMessage | NewMessage> = Omit<T, 'sentDate'> & {
  sentDate?: string | null;
};

type MessageFormRawValue = FormValueOf<IMessage>;

type NewMessageFormRawValue = FormValueOf<NewMessage>;

type MessageFormDefaults = Pick<NewMessage, 'id' | 'sentDate' | 'archived' | 'reaad'>;

type MessageFormGroupContent = {
  id: FormControl<MessageFormRawValue['id'] | NewMessage['id']>;
  status: FormControl<MessageFormRawValue['status']>;
  text: FormControl<MessageFormRawValue['text']>;
  sentDate: FormControl<MessageFormRawValue['sentDate']>;
  archived: FormControl<MessageFormRawValue['archived']>;
  reaad: FormControl<MessageFormRawValue['reaad']>;
  from: FormControl<MessageFormRawValue['from']>;
  too: FormControl<MessageFormRawValue['too']>;
};

export type MessageFormGroup = FormGroup<MessageFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MessageFormService {
  createMessageFormGroup(message: MessageFormGroupInput = { id: null }): MessageFormGroup {
    const messageRawValue = this.convertMessageToMessageRawValue({
      ...this.getFormDefaults(),
      ...message,
    });
    return new FormGroup<MessageFormGroupContent>({
      id: new FormControl(
        { value: messageRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      status: new FormControl(messageRawValue.status),
      text: new FormControl(messageRawValue.text),
      sentDate: new FormControl(messageRawValue.sentDate),
      archived: new FormControl(messageRawValue.archived),
      reaad: new FormControl(messageRawValue.reaad),
      from: new FormControl(messageRawValue.from),
      too: new FormControl(messageRawValue.too),
    });
  }

  getMessage(form: MessageFormGroup): IMessage | NewMessage {
    return this.convertMessageRawValueToMessage(form.getRawValue() as MessageFormRawValue | NewMessageFormRawValue);
  }

  resetForm(form: MessageFormGroup, message: MessageFormGroupInput): void {
    const messageRawValue = this.convertMessageToMessageRawValue({ ...this.getFormDefaults(), ...message });
    form.reset(
      {
        ...messageRawValue,
        id: { value: messageRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MessageFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      sentDate: currentTime,
      archived: false,
      reaad: false,
    };
  }

  private convertMessageRawValueToMessage(rawMessage: MessageFormRawValue | NewMessageFormRawValue): IMessage | NewMessage {
    return {
      ...rawMessage,
      sentDate: dayjs(rawMessage.sentDate, DATE_TIME_FORMAT),
    };
  }

  private convertMessageToMessageRawValue(
    message: IMessage | (Partial<NewMessage> & MessageFormDefaults)
  ): MessageFormRawValue | PartialWithRequiredKeyOf<NewMessageFormRawValue> {
    return {
      ...message,
      sentDate: message.sentDate ? message.sentDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
