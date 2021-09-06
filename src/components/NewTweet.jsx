import React, { Component, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addTweet as addTweetAction } from '../actions';
import Avatar from './Avatar';
import { isEmpty } from '../utils';

// const MAX_CHARS = 60; // TODO: Implement max for input

function useLocalStorageState(
  key,
) {
  const valueInLocalStorage = window.localStorage.getItem(key)

  const[text,setText]= useState( valueInLocalStorage || '')

  const persistThings = useCallback( (key,value) =>{
    window.localStorage.setItem(key,value)
  },[text])

  useEffect(()=>{
    persistThings(key,text)
  },[text])

  return [text,setText]
}

const NewTweet = ({ user, addTweet }) => {

  const [text,setText] = useLocalStorageState('persitedText')
  const publishTweet= useCallback(()=> {
    addTweet({
      content: text,
      userId: user?.id,
      likes: [],
      date: new Date(),
      retweets: 0,
    });
  },[text,user]
  )

    if (!user || isEmpty(user)) {
      return null;
    }

    return (
      <div className="new-tweet">
        <Avatar src={user.avatar} />
        <input
          value={text}
          className="new-tweet-input"
          placeholder="What's happening?"
          data-testid="new-tweet-input"
          onChange={({ target: { value } }) => setText( value )}
        />
        <button
          className="new-tweet-button"
          type="button"
          data-testid="new-tweet-button"
          onClick={publishTweet}
        >
          Tweet
        </button>
      </div>
    );
  
}

NewTweet.propTypes = {
  user: PropTypes.object.isRequired,
  addTweet: PropTypes.func.isRequired,
};

const mapStateToProps = ({ user }) => ({
  user,
});

export default connect(mapStateToProps, { addTweet: addTweetAction })(NewTweet);
