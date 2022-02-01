---
title: "GFS: The Google File System"
imagePath: "/gfs-arch.png"
intro: "MapReduce、GFS 和 BigTable 并称为 Google 的「三驾马车」，他们支撑了 Google 在二十一世纪初的快速发展。其中 GFS 作为第一个大规模部署的分布式文件系统，被 System 领域的顶级会议 SOSP 接收，发表于 2003 年。但是在当时来说，GFS 在理念层面并没有什么很新颖的地方，可以说其中的核心的思想早就被玩烂了；他之所以能被 SOSP 接收，主要在于他是第一个将这些理念实现了出来，并得到了 Google 内部广泛的验证。这些来自工业界的实践可以给学术界以反馈，让人们知道哪些理念是可行的，哪些理念是错误的。"
postDate: "2022-01-30"
---

## 背景

GFS 的研发主要在 2003 年左右，那个时候 Google 的搜索业务已经基本成形，其主要依赖爬虫来定期的抓取互联网上的各种网页，为他们建立索引来帮助人们可以通过简单的关键词快速找到他们。对于互联网上的网页进行抓取、处理和索引对于存储是一个巨大的挑战，Google 需要一个存储服务来承担这项任务。

那时候的 Google 自然可以选择将这个需求外包给 IBM 这种 2B 的企业，但是毫无疑问，这会给他们带来巨额的开销。其实更形式化的来说，这涉及系统层面的 Scale Up 和 Scale Out 两个问题。即当我们的系统无法承载当前业务的需求时，我们需要 Scale 这个系统的负载，这个时候存在两个方向

- Scale Up：增加系统中每个节点的能力，来增加整体的负载
- Scale Out：增加系统中节点的数量，来增加整体的负载

这就好比对于一个军队来说，你想要增加整体的战斗力，你要么 Scale Up，即增加每个士兵的能力，或者 Scale Out，增加士兵的数量。在实践中我们往往可以发现，计算机系统的 Scale Up 的成本往往高于 Scale Out，你把一个 CPU 的主频从 3 GHz 提升到 6 GHz 的成本远高于购买两个 3 GHz 的 CPU 拼到一块。但是并不是所有的系统都有 Scale Out 的能力，设计一个容易 Scale Out 的系统需要我们付出更多的努力。

所以，Google 的选择是 Scale Out，设计出一个运行在消费级电脑组成的集群上可以稳定运行的、高吞吐的分布式文件系统。按照 Paper 中的描述，其当时最大的集群由 1000 个节点组成，提供了总共约 300 TB 的存储空间。

## 设计

![](../public/gfs-arch.png)

GFS 的整体架构如上图所示，Client 部分需要链接一个库来和集群沟通，在 Server 部分包括一个 Master 和若干个 Chunk Server。GFS 作为一个文件系统，其 API 与 POSIX 标准相类似，是一个简化过后的版本。我们可以使用 `/foo/bar/a.txt` 这样的路径来访问一个文件，与 Unix 里常见的路径表示基本一致，我们把这个结构称为 File Namespace。

Master 作为整个 GFS 的中心，仅维护整个系统的 Metadata，而具体文件的数据分布在具体的 Chunk Server 里。对于存储在 GFS 当中的任何一个文件，都按照 64 MB 为单位分割成了若干个连续的 Chunk，同时每个 Chunk 分布在三个位于不同机架上的 Chunk Server 里。这里需要注意的是，GFS 虽然整体的设计是分布式的，但是其还是假设了各个节点之间的高速的网络连接，因此一个 GFS 集群总是部署在一个机房里的，因此如果这个机房发生了停电或者产生了地震之类的灾害，那么整个集群还是会不可避免的崩溃。在一个机房内，可能会出现的一个问题是一个机架发生了倒塌或者电源线被人碰掉，导致整个机架的节点下线，这个时候如果我们的 Chunk 都处在一个机架的 Chunk Server 上，还是会发生数据的丢失，因此我们需要将 Chunk 分布在不同的 Chunk Server 上。同时，这样做还有一个好处是可以增加读的带宽，可以增加对网络拓扑结构的利用率；但是这样的代价是写的时候也需要占用更多的带宽，这是他们在设计时做出的一个 Design Decision。

Master 上不仅存储了整个文件系统的 File Namespace，还存储了 File Path 到 Chunk Handle 的映射，以及每个 Chunk 都存储在哪些 Chunk Server 中。其中 File Namespace 和 File Path 到 Chunk Handle 的映射都是持久化到磁盘上的，但是 Chunk Location 并不持久化。Master 会定期的向每个 Chunk Server 发送 Heartbeat Message 来同步 Chunk Location，但是并不写入磁盘，因为这些信息本身就是由 Chunk Server 同步的，如果我们连向 Chunk Server 请求这些 Metadata 都做不到，就没有理由认为他可以为 Client 提供服务。与之相对的，File Namespace 和 Chunk Handle 的映射是由 Master 唯一指定的，因此这些信息也只能持久化到 Master 上。

### Master & Primary

对于整个 GFS 的协调，我们交由 Master 来负责，但是为了保证 High Availability，我们需要保证每个 Chunk 有 3 个 Replication，这里就涉及到这三个 Replication 之间 Consistency 的问题。考虑当多个客户端需要并发的写某个 Chunk 时，我们需要保证最后在三个 Replication 的结果是一致的，同时我们希望尽可能的减少 Master 的负担，因此希望这个 Consistency 可以由三个 Replication 本身来保证，因此我们需要 Master 在这三个 Replication 之间指定一个 Primary，由他来确定整个 Mutation 的顺序。

这里引出的另一个问题就是，这三个 Replication 本身作为一个分布式的系统，需要就谁是 Primary 这个事情达成一致，即我们不希望有两个 Replication 同时认为自己是 Primary 来接收客户端的请求。这里是由 Master 来发放 Lease 来保证的，即 Master 通过某种方式来确定出三个 Replication 中某一个是 Primary，然后通知这三个 Replication 其中一个 Replication 在未来的 60 秒之内是 Primary。那么如果不出意外，在未来的一段时间内 Master 可以和 Primary 通过 Heartbeat 保持沟通，那么 Master 就会延长这段时间；如果失去了联系，即发生了 Network Partition，那么 Master 就会等到 Lease 过期后重新指定一个新的 Primary，而老的 Primary 在 Lease 过期后没有获得 Master 的续约，就会认为自己不再是 Primary，从而拒绝客户端的请求。可以看出，GFS 通过接受一定时间的不可用来保证了 Replication 之间就 Primary 的 Consistency。

### R & W

```mermaid
sequenceDiagram
    Client->>Master: Read Chunk Index 33 at `/foo/bar`
    Master->>Client: Chunk Handle is ab03d, Primary is Repl.1, Others Repl.2, Repl.3
    Client->>Repl.2: Read Chunk Handle ab03d
    Repl.2->>Client: Payload Data
```

读操作相对来说是比较简单的，Client 对文件的读会转换成一个向 Master 请求 Chunk Location 的 RPC，Client 拿到具体的 Chunk Handle 以及 Chunk Location 后向 Chunk Server 请求具体的数据，然后 Chunk Server 返回数据。在这里，Client 可能会缓存从 Master 返回的信息，即 Chunk Index 对应的 Chunk Handle 和 Chunk Location，以防止重复的请求。但是这里带来的问题就是可能某个 Replication 的数据更新并不及时，因此 Client 可能会读到 Stale 的数据，这个是 GFS 无法避免。作为 Client 如果想要保证数据是最新的，就必须将这些缓存擦除。在选择从哪个 Replication 获取数据的时候，Client 会有一个启发式的算法来挑选最优的 Replication，以保证一个比较优秀的吞吐。

```mermaid
sequenceDiagram
	Client ->> Master: Write Chunk Index 33 at `/foo/bar`
	Master ->> Client: Chunk Handle is ab03d, Primary is Repl.1, Others Repl.2, Repl.3
	par 
			Client ->> Repl.1: Push Data
			Repl.1 ->> Client: ACK
	and 
			Client ->> Repl.2: Push Data
			Repl.2 ->> Client: ACK
	and 
			Client ->> Repl.3: Push Data
			Repl.3 ->> Client: ACK
	end
	Client ->> Repl.1: Do Write
	par
			Repl.1 ->> Repl.2: Do Write
			Repl.2 ->> Repl.1: ACK
	and
			Repl.1 ->> Repl.3: Do Write
			Repl.3 ->> Repl.1: ACK
	end
	Repl.1 ->> Client: Success
```

写过程相比起来就比较复杂了，因为需要涉及到保证数据一致性的问题。首先 Client 向 Master 请求 Chunk Location，和上面一样，这个结果也是缓存到 Client 本地以减少和 Master 的交互的。然后 Client 会把待写入的数据先发送给所有的 Replication，在 Chunk Server 处这部分数据会被放到一个 LRU 的 Buffer 当中。当所有的 Replication 都接收到了数据之后，Client 会向 Primary 发送写的命令，这个时候 Primary 可能会接收到很多并发的写，因此 Primary 需要确定一个唯一的顺序，然后再发送给各个 Replication 执行。当所有的 Replication 都正确的执行了之后，Primary 再向 Client 报告写成功。

这里面可能存在的一个问题是，当 Primary 让其余的 Replication 执行写的时候，这些 Replication 可能会因为种种原因无法执行成功，这个时候 Primary 需要向 Client 报告失败。但是这个时候很可能已经有一些 Replication 写成功了，但是我们又不方便再发送一个撤销的命令，因此 GFS 的做法就是接受这种 Inconsistency，当出现这种情况时客户端就需要接受这个时候数据在 Replication 之间是 Inconsistency 的。

### Atomic Record Append

GFS 选择支持的一个比较奇妙的功能叫做 Atomic Record Append。我们知道对于一个 Client 来说，想要写一个文件就必须提供这个文件的路径和 Offset，但是 Atomic Record Append 可以不提供 Offset，只是把一段数据 Append 到这个文件的末尾。GFS 保证当客户端调用这个功能时，相关的数据会被添加到末尾至少一次：

> A record append causes data (the “record”) to be appended atomically at least once even in the presence of concurrent mutations, but at an offset of GFS’s choosing.

GFS 主要依赖这个操作来支持多个客户端的并发操作，主要的应用场景应该是将多个数据流产生的结果合并到一个文件当中。Record Append 主要的路径和上面提到的 Write 其实是一致的，这里比较奇怪的「至少一次」，主要是因为在最后一步 Do Write 的过程中，可能会有一部分 Replication 无法成功执行，但是这另外的一些 Replication 上已经被执行了，因此 GFS 只能选择重新将数据 Append 一遍，这就造成了相同的数据在 Primary 上添加了两遍。

这样的实现看起来问题很多，但是对于大部分不接受数据重复的场景来说，我们可以简单的增加一个 Unique ID 来区分重复的数据。这个功能实际上是实现在了 GFS 当中，客户端的可以通过简单的配置来实现过滤的功能。其实更宽泛的来讲，这涉及到计算机科学中幂等的概念，即 Idempotent。即对于一个系统来说，重复执行一个操作对于这个系统状态的改变等价于只执行一次，如果我们 GFS 所对接的场景是幂等的，我们就完全没有必要实现重复数据的过滤。GFS 的使用者在其基础之上设计应用时也要考虑其中，尽可能的保证其系统是幂等的，以减少不必要的 overhead。

## Discussion

除了上面提到的这些，GFS 还有 Snapshot 来实现 File Namespace 的 COW，以及 Shadow Master 来减少 Master 的崩溃对整个系统的影响，不过这些并没有很值得讨论的地方，这里就略过了。GFS 整体的设计还是比较简单易于理解的，从 CAP 的角度来看 GFS 相当于是放弃了 Consistency 来保证 A 和 P，Client 可能会读到不 Consistent 的数据，写入的数据在不同的 Replication 甚至不能保证一致。但是在实际的场景中，我们总是可以通过各种 workaround 来解决这种问题，it's not really that important.

## Reference

1. [The Original Paper](https://static.googleusercontent.com/media/research.google.com/en//archive/gfs-sosp2003.pdf)

2. [6.824 Lecture 3: GFS](https://www.youtube.com/watch?v=EpIgvowZr00)
