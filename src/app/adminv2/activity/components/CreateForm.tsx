'use client';

import { ActivityStatus, ActivityType } from '@prisma/client';
import { useState } from 'react';
import { useFormState } from 'react-dom';

import { createActivityAction } from '../../../../services/activities/action';

export function CreateForm() {
  const [state, dispatch] = useFormState(createActivityAction, { errors: {}, message: null });
  const [isShowTime, setIsShowTime] = useState(false);

  return (
    <form action={dispatch}>
      <div>
        {state.errors?.title ? <p color="red">{state.errors.title}</p> : null}
        <label htmlFor="title">title: </label>
        <input type="text" id="title" name="title" required />
      </div>

      <div>
        {state.errors?.status ? <p color="red">{state.errors.status}</p> : null}
        <label htmlFor="status">status: </label>
        <select id="status" name="status" required>
          {Object.keys(ActivityStatus).map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </div>

      <div>
        {state.errors?.type ? <p color="red">{state.errors.type}</p> : null}
        <label htmlFor="type">type: </label>
        <select id="type" name="type" required>
          {Object.keys(ActivityType).map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        {state.errors?.detailURL ? <p color="red">{state.errors.detailURL}</p> : null}
        <label htmlFor="detailURL">detailURL: </label>
        <input type="url" id="detailURL" name="detailURL" required />
      </div>

      <div>
        {state.errors?.thumbnail ? <p color="red">{state.errors.thumbnail}</p> : null}
        <label htmlFor="thumbnail">thumbnail: </label>
        <input type="file" id="thumbnail" name="thumbnail" required />
      </div>

      <div>
        <label htmlFor="isShowTime">isShowTime: </label>
        <input
          type="checkbox"
          id="isShowTime"
          name="isShowTime"
          value="true"
          onChange={(e) => setIsShowTime(e.currentTarget.checked)}
        />
      </div>

      <div>
        {state.errors?.startAt ? <p color="red">{state.errors.startAt}</p> : null}
        <label htmlFor="startAt">startAt: </label>
        <input type={isShowTime ? 'datetime-local' : 'date'} id="startAt" name="startAt" required />
      </div>

      <div>
        {state.errors?.endAt ? <p color="red">{state.errors.endAt}</p> : null}
        <label htmlFor="endAt">endAt: </label>
        <input type={isShowTime ? 'datetime-local' : 'date'} id="endAt" name="endAt" />
      </div>

      <div>
        {state.errors?.endNote ? <p color="red">{state.errors.endNote}</p> : null}
        <label htmlFor="endNote">endNote: </label>
        <input type="text" id="endNote" name="endNote" />
      </div>

      <button type="submit">create</button>
    </form>
  );
}
