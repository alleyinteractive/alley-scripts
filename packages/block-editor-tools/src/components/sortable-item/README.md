# SortableItem

Used in conjuction with Sortable to allow for a sortable list where users can add, remove, and update items.

## Usage

``` js
<Sortable
  emptyItem=""
  list={myList}
  setList={setMyList}
>
  {mylist && mylist.length
    ? mylist.map((mylistItem: string, index: number) => (
      <SortableItem
        index={index}
        key={index} // eslint-disable-line react/no-array-index-key
        list={mylist}
        setList={updateMyList}
      >
        <TextControl
          label={__('Item Text', 'alley-scripts')}
          onChange={(next: string) => {
            const newList = [...mylist];
            newList[index] = next;
            updateMyList(newList);
          }}
          value={mylistItem}
        />
      </SortableItem>
    )) : null}
</Sortable>
```

There are additional options for the Sortable that can be configured via the
props listed below.

## Props

| Prop    | Default | Required | Type     | Description                                  |
|---------|---------|----------|----------|----------------------------------------------|
| index   |         | Yes      | number   | The index of the list item within the array. |
| key     |         | No       | number   | string                                       |
| list    |         | Yes      | array    | The array we iterating through.              |
| setList |         | Yes      | function | The function to update the array.            |
