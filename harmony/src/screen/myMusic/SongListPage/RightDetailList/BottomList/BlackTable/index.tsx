import * as React from 'react';
import { connect } from 'react-redux';
import './index.scss';

import { Pagination, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import WhiteScrollBar from 'src/components/WhiteScrollBar';
import PlayerContext from 'src/store/PlayerContext';
import UserContext from 'src/store/UserContext';


interface BlackTableProps {
  columns: any[];
  dataSource: any[];
  itemClassName?: string;
  useHeader?: boolean;

  loading: boolean;
  currentListId: 1;
  currentSong?: { [propName: string]: any };
  currentDetailListInfo: { [propName: string]: any };
  currentDetailListPage: number;

}

interface BlackTableState {
  page: number;
  listId: any;
  currentDetailListPage: number; 
}

interface colStruct {
  key: string;
  className: string;
}

class BlackTable extends React.Component<BlackTableProps, BlackTableState> {
  state = {
    page: 1,
    listId: '', 
    currentDetailListPage: 1, // Current page
  };
  // Change page number
  changeDetailListPage = (page: number, pageSize: number) => {
    let finalPage = page;
    this.setState({ 
      page: finalPage, 
      currentDetailListPage: finalPage // Update this
    });
   
    // this.props.changeCurrentListPage(finalPage);
    console.log(this.state.currentDetailListPage)
    // this.setState({ page: finalPage });
    if (finalPage > 0) finalPage--;
  
    // this.props.changeSongListId(this.props.currentListId, finalPage * pageSize);
  };



  // Change displayed song depend on the pagenation
  static getDerivedStateFromProps(
    props: BlackTableProps,
    state: BlackTableState,
  ) {
    let listId = state.listId;
    // if (props.currentListId.id != state.listId) listId = props.currentListId.id;
  
    return {
      page: state.currentDetailListPage, // Using state value instead of props value
      listId,
    };
  }


  
  render() {
    const pageSize = 5;
    let currentPageData = this.props.dataSource.slice((this.state.page - 1) * pageSize, this.state.page * pageSize);
  
    let keyMap: colStruct[] = [];
    // Map the column name with the song attributes
    const headerComponent = this.props.useHeader ? (
      <div className="table_header">
        {this.props.columns.map((val: any) => {
          if (val.key) keyMap.push({ key: val.key, className: val.className });
          return (
            <div className={`table_header_item ${val.className}`} key={val.key}>
              {val.render ? val.render(val) : val.title}
            </div>
          );
        })}
      </div>
    ) : undefined;
    if(!(Array.isArray(currentPageData) &&  currentPageData !== null)){
      currentPageData = []
    }
    // All components for the table items
    const bodyComponent = (
      <div className="table_body">
        <WhiteScrollBar
          fullHeight={true}
          key={this.state.listId + '' + this.state.page}
        >
          
          {currentPageData.map((val: any) => {
            return (
              <div
                className={`${this.props.itemClassName} table_body_item ${
                  this.props.currentSong && this.props.currentSong.MusicID == val.MusicID
                    ? 'active'
                    : ''
                }`}
                key={val.MusicID}
                onDoubleClick={() => {PlayerContext.setCurrentSong(val); }}
              >
                {keyMap.map((i) => (
                  <div
                    className={`table_body_item_box ${i.className} ${
                      val.className ? val.className : ''
                    }`}
                    key={i.key}
                  >
                    {val[i.key]} 
                  </div>
                ))}
             
              </div>
            );
          })}
        </WhiteScrollBar>
      </div>
    );
    
    // Pagenation compoennt
    const paginationComponent = (
      <Pagination
        className="black_pagination"
        current={this.state.currentDetailListPage}
        onChange={this.changeDetailListPage}
        total={
          this.props.currentDetailListInfo
            ? this.props.currentDetailListInfo.trackCount
            : 0
        }
        pageSize={pageSize}
        showSizeChanger={false}
      />
    );
  
    return (
      <div className="black_table">
        {headerComponent}
        <Spin
          spinning={this.props.loading}
          indicator={
            <LoadingOutlined style={{ fontSize: 24, color: '#fff' }} />
          }
        >
          {bodyComponent}
          {paginationComponent}
        </Spin>
      </div>
    );
  }
  
}



export default BlackTable