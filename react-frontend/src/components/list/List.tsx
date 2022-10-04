import Issue from '../issue/Issue';
import DroppableWrapper from '../dnd/DroppableWrapper';
import DraggableWrapper from '../dnd/DraggableWrapper';
import type { Issue as ApiIssue, List as LIST } from '../../api/apiTypes';
import { Icon } from '@iconify/react';
import { lazy, Suspense, useState } from 'react';
import { useDeleteListMutation, useUpdateListMutation } from '../../api/lists.endpoint';
const ConfirmModel = lazy(() => import('../util/ConfirmModel'));

interface Props extends LIST {
  idx: number;
  issues?: ApiIssue[];
  isDragDisabled: boolean;
}

const List = (props: Props) => {
  const { idx, name: NAME, id, projectId, issues, isDragDisabled } = props;
  const [deleteList] = useDeleteListMutation();
  const [name, setName] = useState(NAME);
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [updateList] = useUpdateListMutation();

  const handleUpdateList = () => {
    // when the user saves
    if (isEditing && name !== NAME) {
      updateList({ listId: id, body: { projectId, name } });
    }
    setIsEditing((p) => !p);
  };

  return (
    <>
      <DraggableWrapper
        className='w-[clamp(16rem,18rem,20rem)]'
        index={idx}
        draggableId={'list-' + id}
        isDragDisabled={isDragDisabled}
      >
        <div className='relative mr-3 bg-c-2 p-3 shadow-list text-c-5'>
          <div className='mb-4 text-[15px] flex justify-between items-center'>
            <div className='flex item-center'>
              <div className='relative'>
                {isEditing ? (
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                    className='bg-c-2 pl-2 w-36 border-[1.5px] text-[15px] focus:border-chakra-blue outline-none'
                  />
                ) : (
                  <span className='pl-2 block font-medium border-[1.5px] border-transparent'>
                    {name}
                  </span>
                )}
              </div>
              <span className='mx-2 text-gray-500'>|</span>
              <span className='font-bold text-c-4 pt-[1px]'>{issues ? issues.length : 0}</span>
            </div>
            <div className='flex gap-2'>
              {isEditing && (
                <button
                  onClick={() => setIsOpen(true)}
                  title='Delete'
                  className='icon-btn ml-5 hover:bg-c-3'
                >
                  <Icon icon='bx:trash' className='text-red-500' />
                </button>
              )}
              <button
                onClick={handleUpdateList}
                title={isEditing ? 'Save' : 'Edit'}
                className='icon-btn hover:bg-c-3'
              >
                <Icon icon={isEditing ? 'charm:tick' : 'akar-icons:edit'} />
              </button>
            </div>
          </div>
          <DroppableWrapper className='min-h-[3rem]' type='issue' droppableId={'list-' + id}>
            {issues?.map((data, i) => (
              <Issue
                isDragDisabled={isDragDisabled}
                key={data.id}
                listIdx={idx}
                idx={i}
                {...data}
                listId={id}
              />
            ))}
          </DroppableWrapper>
        </div>
      </DraggableWrapper>
      {isOpen && (
        <Suspense>
          <ConfirmModel
            onClose={() => setIsOpen(false)}
            onSubmit={() => deleteList({ listId: id, projectId })}
          />
        </Suspense>
      )}
    </>
  );
};

export default List;
