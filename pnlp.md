# The pnlp protocol
​
The pnlp protocol prints an `Issue` once per `publicationInterval`. An `Issue` is an `Article[]` (array); plus an `Editor[]`; plus some metadata. `Articles` are chosen from a `SubmissionPool`. `Submissions` are wannabe `Articles` that are posted to the pool by anyone in the general public using `SubmissionCollateral`. Meanwhile, any holder of `pnlp` can stake that `pnlp` to a `Submission`, indicating an endorsement by an `Editor`. Once per `publicationInterval`, a contract looks at the `PointInTimePnlpDistribution` across all submissions to decide which ones get published in the next `Issue`. When an `Submission` is chosen and published as an `Article`, the author gets a small fraction of the `pnlp` that was staked to their the `Article`. In this way authors become editors.
​
​
## User Stories
​
As a Reader, I subscribe to the publication on an RSS feed or an email list. I get publications filled with a few (or many) articles once in a while. I hardly even know there's a blockchain involved if I weren't actually interested in it.
​
As an Author, I submit content to a submission contract. I can petition Editors to stake pnlp to my submission, this would indicate to the system that I'm writing good content and that the Editors endorse the content. To keep the submission posted I need to put down a small deposit. At any point I can decide I want my deposit back and withdraw the submission. If my submission is selected for publication, I get a small fraction of the endorsing pnlp that was staked to it. I can now act as an Editor. I hardly even know there's a blockchain involved if I weren't interested in it.
​
As an Editor, I have submitted content before and gotten it published. This makes me proud of the publication. I don't want my good content to be crowded out with bad content. Instead I want it surrounded and bolstered by other good content, better yet it's content that I don't necessarily have time to write myself. So I scroll the submission board in my free time, looking for content that I would endorse. With my `pnlp` collection that I've built, I have a voice in what gets published and that makes me invested in maintaing a good brand. I hardly even know there's a blockchain involved if I weren't interested in it.
​
​
## Parameters:
​
###### pnlpSubmissionAddress
* The ethereum contract address where Decentralizing Times accepts content submissions.
​
###### publicationInterval
* Time between publications
​
###### publishOptions
* Influence thresholds for passable Submissions; how high do you want to set the bar?
​
​
## Definitions
​
###### pnlp
* "the token": except I don't think we should encourage users to think about it as a token.
* a slice of voice on the editorial board
* tradable on exchanges? what if not or culturally prohibited?
* I think would be more conducive to this idea if authors and editors visualized this less as a coin and more as a stamp or a share of editorial power. These things are integers in a contract... it's interesting that "token" and "coin" are settled visualizations of finite sets in these contracts, but I don't think it has to be that way. Psychology is everything when it comes to apps like this and I like the psychology of something other than coins here...
​
​
###### SubmissionContract (Contract)
- submit(submission: Submission) => { id: string }
	* public: can be invoked by any address trying to publish content
	* adds the Submission to the submission pool
- markAsPublished(submission_id: String) => { published: boolean }
	* authorized: can only be invoked by the PublishContract
	* adds the submission to the next issue block
	* removes the Submission from the submission pool
	* releases the collateral
- withdrawSubmission(submission_id: String) => { withdrawn: boolean }
	* authorized: can only be invoked by the original sender of the "submit()" method
	* removes the Submission from the submission pool
	* releases the collateral
​
​
​
###### Submission (Data Structure)
* id
* collateral
* multi-uri which points to article (hopefully an ipfs address but maybe a url is acceptable at first)
* multi-hash to guarantee article
​
​
###### PublishContract (Contract)
- publish()
	* can be invoked once per publicationInterval
	* runs the publishable_pnlp_ratio algorithm against the submission pool, arriving at some subset of submissions to publish
	* copies over the defining characteristics (author's address, multi-uri, multi-hash) of each Submission and tags them with various metadata to create a new object: an Article.
	* takes a snapshot of the pnlp_distribution that got published and the senders of said pnlp as an array of Editor.
	* NOTE: for technical reasons, I think it has to be invoked and can't be set to run on a schedule (unless ethereum has added that functionality in the last three years). but we can get away with this easily enough by allowing _anyone_ to invoke it and limiting that it only be invoked once per some interval. Then we can just invoke it at the moment every publicationInterval starts and if we don't, anyone else is free to.
​
###### Article (Data Structure)
* article_id
* issue_id
* submitted_timestamp
* pnlp_ratio_at_publish
* author_address
* multi-uri
* multi-hash
​
###### Issue (Data Structure)
* issue_id
* Articles[] articles
* Editor[] editors
​
###### Editor (Data Structure)
* pnlp[]: the 2-D array of staked pnlp crossing Editors and Articles at the point in time when the Issue was published
* x[]: the article_id that each column corresponds to
* aka: PointInTimePnlpDistribution. At any given moment in time, there exists some distribution of pnlp that is staked across all the content in the submission pool. The slice of that distribution which contributed to the published articles is the collective Editor.
​
​
###### PointInTimePnlpDistribution (Type = Editor[])
​
###### Editor (Type = Address) an Ethereum address that holds pnlp
​
###### SubmissionCollateral (TBD)
TODO: Here we need some known-value defi instrument whose underlying we are confident in. The central reason for Submission Collateral is to prevent spammy submission content. While content is "open for submission" your collateral is locked up. In fact, that's the definition of submitted content: the required collateral with a pointer to a multi-uri and a multi-hash of the content. At any point you can pull your content from submission to free your collateral. If your content is chosen for submission, your collateral... is returned to you? Is allocated to pay the brand hosting fees?
​
​
###### Method publishable_pnlp_ratio(Submission[] submissions, PublishOptions options)
	* the algorithm that decides which submissions in the submission pool pass the bar for publishing
	* options allow publish criteria to be passed in by the pnlp implementor (ie The Decentralizing Times will use a specific set of these options)
​
###### PublishOptions (Data Structure)
	* max_articles: the upper bound on articles per publication (ie a daily email newsletter might set this at 1 with the publishInterval to be a day)
	* min_articles: the lower bound on articles per publication
	* e: the steepness of the lower acceptable decline in quality (measured by staked pnlp)
