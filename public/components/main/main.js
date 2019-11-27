import React, { Component, Fragment } from 'react';
import {
  EuiPage,
  EuiPageHeader,
  EuiTitle,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentHeader,
  EuiPageContentBody,
  EuiText,
  EuiFieldText,
  EuiSwitch, EuiSpacer,
  EuiRadioGroup, EuiRadio,
  EuiFlexItem,
  EuiFlexGroup,
  EuiPanel, EuiCode,
  EuiTextArea, EuiComboBox,
  EuiButton, EuiFormRow
} from '@elastic/eui';

// occurs error if : import makeId from '@elastic/eui
import makeId from '@elastic/eui/lib/components/form/form_row/make_id';

import { FormattedMessage } from '@kbn/i18n/react';
import posData from '../kr-pos.json';

export class Main extends Component {
  constructor(props) {
    super(props);
    
    // nori_tokenizer : decompound_mode elements
    const decMId = makeId();
    this.decMRadios = [
      {id: `${decMId}0`, label: 'none',},
      {id: `${decMId}1`, label: 'discard (default)',},
      {id: `${decMId}2`, label: 'mixed',},
    ];
    this.decompModeTxtVal={
      [`${decMId}0`]: `["decompound_mode": "none"]

복합어를 분해하지 않고 그대로 저장합니다
서울대 => 서울대`,
      [`${decMId}1`]: `["decompound_mode": "discard"]

복합어를 분해한 어근을 저장합니다
서울대 => 서울, 대`,
      [`${decMId}2`]: `["decompound_mode": "mixed"]

복합어를 분해한 어근과 복합어를 모두 저장합니다
서울대 => 서울대, 서울, 대`,
    };

    this.posOptions = posData.DATA;
    this.posDefault = posData.defalut_stoptags;
    // states
    this.state = {
      indexName: '',
      decMRadioIdSelected: `${decMId}1`,
      decompModeTxt: this.decompModeTxtVal[`${decMId}1`],
      inputTxt: '',
      userDictChecked: false,
      uDictPanChecked: true,
      uDictRulePanChecked: false,
      uDictPath: '',
      uDictWords: [],
      stoptagsChecked: false,
      selectedPosOptions: this.posDefault,
      posError: undefined,
    };
  }

  onPosChange = selectedOptions => {
    this.setState({
      posError: undefined,
      selectedPosOptions: selectedOptions,
    });
  };

  // 분석할 텍스트 설정 : Text to analyze
  onInputTxtChange = e => {
    this.setState({
      inputTxt: e.target.value,
    });
  }

  // 인덱스명 설정 - Index Name settings
  onIndexNameChange = e => {
    this.setState({
      indexName: e.target.value,
    });
  };
  
  // decompound_mode 라디오 버튼 설정
  onDecMRadioChange = decMRadiOptionId => {
    this.setState({
      decMRadioIdSelected: decMRadiOptionId,
      decompModeTxt: this.decompModeTxtVal[decMRadiOptionId],
    });
  };

  // user_dictionary 설정
  onSetUserDictChange = e => {
    this.setState({
      userDictChecked: e.target.checked,
    });
  };
  onUDictPanChange = e => {
    this.setState({
      uDictPanChecked: e.target.checked,
      uDictRulePanChecked: !e.target.checked,
    });
  };
  onUDictRulePanChange = e => {
    this.setState({
      uDictRulePanChecked: e.target.checked,
      uDictPanChecked: !e.target.checked,
    });
  };
  onUDictPathChange = e => {
    this.setState({
      uDictPath: e.target.value,
    });
  };
  onUDictWordsCreateOption = searchValue => {
    const newOption = {
      label: searchValue,
    };
    this.setState(prevState => ({
      uDictWords: prevState.uDictWords.concat(newOption),
    }));
  };
  onUDictWordsChange = uDictWords => {
    this.setState({
      uDictWords,
      // isInvalid: false,
    });
  };

  // nori_part_of_speech
  onStoptagsChange = e => {
    this.setState({
      posError: undefined,
      stoptagsChecked: e.target.checked,
    });
  };
  onPosSearchChange = (value, hasMatchingOptions) => {
    this.setState({
      posError:
        value.length === 0 || hasMatchingOptions
          ? undefined
          : `"${value}" 는 유효하지 않은 옵션입니다.`,
    });
  };
  onPosBlur = () => {
    const { value } = this.inputRef;
    this.setState({
      error:
        value.length === 0 ? undefined : `"${value}" 는 유효하지 않은 옵션입니다.`,
    });
  };
  setPosInputRef = ref => (this.inputRef = ref);


  componentDidMount() {
    /*
       FOR EXAMPLE PURPOSES ONLY.  There are much better ways to
       manage state and update your UI than this.
    */
    const { httpClient } = this.props;
    httpClient.get('../api/kibana-nori-manager/example').then((resp) => {
      this.setState({ time: resp.data.time });
    });
  }

  render() {
    const { title } = this.props;
    return (
      <EuiPage>
        <EuiPageBody>
          <EuiPageHeader>
            <EuiTitle size="m">
              <h1>
                <FormattedMessage
                  id="kbNoriMgr.helloWorldText"
                  defaultMessage="Korean (nori) Analysis Plugin Manager"
                  values={{ title }}
                />
              </h1>
            </EuiTitle>
          </EuiPageHeader>
          <EuiPageContent>

          <EuiFlexGroup>
            <EuiFlexItem>
            <Fragment>
              <EuiPageContentBody>
                <EuiText>

<h2>분석할 텍스트 (Text to analyze)</h2>
<div>
  <EuiFlexGroup>
    <EuiFlexItem>
      <EuiTextArea
      fullWidth={true}
      placeholder="분석할 텍스트를 입력하세요"
      aria-label="Text to analyze"
      value={this.state.inputTxt}
      onChange={this.onInputTxtChange}
      />
    </EuiFlexItem>
    <EuiFlexItem grow={false}>
      <EuiButton fill onClick={() => window.alert('Button clicked')}>Analyze!!</EuiButton>
    </EuiFlexItem>
  </EuiFlexGroup>
</div>

<h2>인덱스명 (Index Name)</h2>
<EuiFieldText
placeholder="인덱스명 (Index Name)"
value={this.state.indexName}
onChange={this.onIndexNameChange}
/>
              
<h2>Analyzer 설정</h2>

<h3>nori_tokenizer</h3>

<h4>decompound_mode</h4>
<div>
  <EuiFlexGroup>
    <EuiFlexItem grow={false}>
    <EuiRadioGroup
      options={this.decMRadios}
      idSelected={this.state.decMRadioIdSelected}
      onChange={this.onDecMRadioChange}
    />
    </EuiFlexItem>
    <EuiFlexItem>
      <EuiPanel paddingSize="none">
        <pre style={{margin:0}}>{this.state.decompModeTxt}</pre>
      </EuiPanel>
    </EuiFlexItem>
  </EuiFlexGroup>
</div>

<h4>
<EuiSwitch
label="사용자 정의 사전 사용"
checked={this.state.userDictChecked}
onChange={this.onSetUserDictChange}
/>
</h4>

<EuiPanel paddingSize="s">
  <h4>
  <EuiRadio
  id={makeId()}
  label="user_dictionary"
  checked={this.state.uDictPanChecked}
  onChange={this.onUDictPanChange}
  compressed
  disabled={!this.state.userDictChecked}
  />
  </h4>
  <p>저장된 사전 파일을 사용합니다</p>
  <EuiFieldText
  prepend="$ES_HOME/config/"
  placeholder="사전 파일 경로"
  value={this.state.uDictPath}
  onChange={this.onUDictPathChange}
  disabled={!(this.state.userDictChecked && this.state.uDictPanChecked)}
  fullWidth
  />
</EuiPanel>
<EuiSpacer size="m" />
<EuiPanel paddingSize="s">
  <h4>
  <EuiRadio
  id={makeId()}
  label="user_dictionary_rules"
  checked={this.state.uDictRulePanChecked}
  onChange={this.onUDictRulePanChange}
  compressed
  disabled={!this.state.userDictChecked}
  />
  </h4>
  <p>Index Settings 설정에 직접 사전을 입력합니다</p>
  <EuiComboBox
  noSuggestions
  fullWidth
  placeholder="사전을 입력하세요 (엔터로 등록)"
  selectedOptions={this.state.uDictWords}
  onCreateOption={this.onUDictWordsCreateOption}
  onChange={this.onUDictWordsChange}
  isDisabled={!(this.state.userDictChecked && this.state.uDictRulePanChecked)}
  />
</EuiPanel>

<h3>nori_part_of_speech</h3>

<h4>
<EuiSwitch
label="stoptags"
checked={this.state.stoptagsChecked}
onChange={this.onStoptagsChange}
/>
</h4>

<EuiFormRow fullWidth={true}
error={this.state.posError}
isInvalid={this.state.posError !== undefined}>
  <EuiComboBox
  fullWidth={true}
  placeholder="제거할 POS TAG를 입력하세요"
  options={this.posOptions}
  selectedOptions={this.state.selectedPosOptions}
  onChange={this.onPosChange}
  // onCreateOption={this.onCreatePosOption}
  isClearable={true}
  onSearchChange={this.onPosSearchChange}
  inputRef={this.setPosInputRef}
  onBlur={this.onPosBlur}
  isDisabled={!this.state.stoptagsChecked}
  />
</EuiFormRow>

              </EuiText>
            </EuiPageContentBody>
            </Fragment>
          </EuiFlexItem>

          <EuiFlexItem>

          </EuiFlexItem>
          </EuiFlexGroup>

            

{/* 
            <EuiPageContentHeader>
              <EuiTitle>
                <h2>
                  <FormattedMessage
                    id="kibanaNoriManager.congratulationsTitle"
                    defaultMessage="Nori 한국어 형태소 분석기 테스트 도구입니다"
                  />
                </h2>
              </EuiTitle>
            </EuiPageContentHeader>
 
            <EuiPageContentBody>
              <EuiText>
                <p>
                  <FormattedMessage
                    id="kibanaNoriManager.serverTimeText"
                    defaultMessage="The server time (via API call) is {time}"
                    values={{ time: this.state.time || 'NO API CALL YET' }}
                  />
                </p>
              </EuiText>
            </EuiPageContentBody>
 */}

          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    );
  }
}
