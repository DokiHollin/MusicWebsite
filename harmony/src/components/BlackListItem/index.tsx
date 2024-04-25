import * as React from 'react';
import './index.scss';
import { deleteListById } from 'src/api/SongList';
import Left from 'src/screen/myMusic/SongListPage/LeftMainList'
import UserContext from 'src/store/UserContext';
interface BlackListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: JSX.Element;
  iconBefore?: JSX.Element;
  align?: React.CSSProperties['textAlign'];
  keys?: any;
}

interface BlackListItemState {
  contextMenuVisible:boolean;
  contextMenuX: any;
  contextMenuY: any;
  selectedPlaylistId: any;
}

class BlackListItem extends React.Component<
  BlackListItemProps,
  BlackListItemState
> {

  
  state = {
    contextMenuVisible: false,
    contextMenuX: 0,
    contextMenuY: 0,
    selectedPlaylistId: null
  };
  showContextMenu = (e: { preventDefault: () => void; clientX: any; clientY: any; }, playlistId: any) => {
    
    e.preventDefault();
    console.log('u just right click on ' + playlistId )    
    this.setState({
          contextMenuVisible: true,
          contextMenuX: e.clientX,
          contextMenuY: e.clientY,
          selectedPlaylistId: playlistId
      });
  }

  hideContextMenu = () => {
      this.setState({
          contextMenuVisible: false,
          contextMenuX: 0,
          contextMenuY: 0,
          selectedPlaylistId: null
      });
  }

  handleDelete = () => {
    const { selectedPlaylistId } = this.state;
    if (selectedPlaylistId) {
        deleteListById(selectedPlaylistId);
    }
    UserContext.setUpdate(true);
    this.hideContextMenu();
  }
  render() {
    return (
      <div
        className={this.props.className + ' black_list_item_style'}
        style={{ textAlign: this.props.align ? this.props.align : 'left' }}
        onContextMenu={(e) => this.showContextMenu(e, this.props.keys)}
        onClick={(e) => {
          e.preventDefault();
          this.hideContextMenu();
          this.props.onClick!(e);
        }}
      >
        {this.props.iconBefore}
        <div className="black_list_item_content">{this.props.children}</div>
        {this.state.contextMenuVisible && (
                  
                  <div
                      style={{
                          position: 'absolute',
                          top: '50%',
                          left: '70%',
                          width: '100px',
                          backgroundColor: 'transparent',
                          border: 'transparent',
                          fontSize: '10px',
                          color: 'red',
                      }}
                      onClick={this.hideContextMenu}
                  >
                   
                      <div onClick={this.handleDelete}>Delete</div>
                  </div>
              )}
      </div>
    );
  }
}

export default BlackListItem;
