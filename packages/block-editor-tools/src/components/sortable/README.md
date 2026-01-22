# Sortable

Used in conjuction with SortableItem to allow for a sortable list where users can add, remove, and update items.

## Usage

``` js
<Sortable
  emptyItem=""
  list={myList}
  setList={setMyList}
  buttonText=""
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

There are additional options for the SortableItem that can be configured via the
props listed below.

## Props

| Prop       | Default  | Required | Type     | Description                                                 |
|------------|----------|----------|----------|-------------------------------------------------------------|
| emptyItem  |          | Yes      | any      | Empty array item to use when adding a new item to the array |
| list       |          | Yes      | array    | The array to sort and modify                                |
| setList    |          | Yes      | function | Function to update the array                                |
| buttonText | Add Item | No       | string   | String for the button to add a new sortable item            |
